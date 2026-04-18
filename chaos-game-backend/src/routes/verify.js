const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const { verifyImage, generateJudgment } = require('../services/hfService');

// Configure ffmpeg to use static binaries
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, webp) and videos (mp4, mov, webm) are allowed'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Helper to extract middle frame from video
const extractFrame = (videoPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = videoPath + '-frame.png';
    
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      
      const duration = metadata.format.duration;
      const midpoint = duration / 2;

      ffmpeg(videoPath)
        .screenshots({
          timestamps: [midpoint],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
        })
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    });
  });
};

router.post('/', upload.single('image'), async (req, res) => {
  const filePath = req.file ? req.file.path : null;
  let tempFramePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { taskLabel, taskText } = req.body;
    const isVideo = req.file.mimetype.startsWith('video/');
    
    console.log(`[Verify] Processing ${isVideo ? 'video' : 'photo'} for task: ${taskLabel}`);

    let pathToVerify = filePath;

    if (isVideo) {
      console.log(`[Verify] Extracting frame from video...`);
      tempFramePath = await extractFrame(filePath);
      pathToVerify = tempFramePath;
    }

    // AI Verification
    const verification = await verifyImage(pathToVerify, taskLabel);
    
    // AI Judgment
    const judgment = await generateJudgment(taskText, verification.passed);

    console.log(`[Verify] Result: ${verification.passed ? 'PASSED' : 'FAILED'} (${verification.confidence.toFixed(2)})`);

    res.json({
      passed: verification.passed,
      topLabel: verification.topLabel,
      confidence: verification.confidence,
      mediaType: isVideo ? 'video' : 'photo',
      judgment
    });

  } catch (error) {
    console.error('[Verify Error]:', error.message);
    res.status(500).json({ error: 'Verification process failed.' });
  } finally {
    // Cleanup
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (tempFramePath && fs.existsSync(tempFramePath)) fs.unlinkSync(tempFramePath);
  }
});

module.exports = router;
