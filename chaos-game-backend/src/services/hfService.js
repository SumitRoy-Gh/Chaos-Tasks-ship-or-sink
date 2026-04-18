const Groq = require('groq-sdk');
const { HfInference } = require('@huggingface/inference');
const fs = require('fs');

// Groq for text generation (fast + free + reliable)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Hugging Face only for image verification (CLIP)
const hf = new HfInference(process.env.HF_TOKEN);


// ── 1. GENERATE A TASK ──────────────────────────────────────────────
// Uses Groq (Llama 3.1)
async function generateTask(difficulty) {
  let difficultyConstraint = "";
  if (difficulty === 'easy') {
    difficultyConstraint = "simple silly tasks (example: wave at a stranger, touch your toes)";
  } else if (difficulty === 'medium') {
    difficultyConstraint = "more effort needed (example: do 10 pushups, balance a book on your head)";
  } else if (difficulty === 'hard') {
    difficultyConstraint = "chaotic and challenging (example: bark like a dog outside for 10 seconds, do a handstand)";
  }

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are the Chaos Master. Generate a task for a user. 
Difficulty: ${difficulty}. 
Type: ${difficultyConstraint}.
Return a JSON object with:
"task": one short crazy sentence,
"taskLabel": a 1-2 word label summarizing it (e.g. "wave", "pushups", "bark").`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = JSON.parse(response.choices[0].message.content);
  return content;
}


// ── 2. VERIFY IMAGE ──────────────────────────────────────────────────
// Still uses Hugging Face CLIP for image checking
async function verifyImage(imagePath, taskLabel) {
  const imageData = fs.readFileSync(imagePath);

  const candidateLabels = [
    taskLabel,
    'random object',
    'person',
    'food',
    'outdoor scene',
    'nothing relevant'
  ];

  try {
    const result = await hf.zeroShotImageClassification({
      model: 'openai/clip-vit-base-patch32',
      inputs: { image: imageData },
      parameters: { candidate_labels: candidateLabels }
    });

    const topResult = result[0];
    const passed = topResult.label === taskLabel && topResult.score > 0.3;

    return {
      passed,
      topLabel: topResult.label,
      confidence: topResult.score
    };

  } catch (error) {
    console.error('[CLIP Error]:', error.message);
    return {
      passed: false,
      topLabel: 'error',
      confidence: 0,
      error: error.message
    };
  }
}


// ── 3. GENERATE REWARD / JUDGMENT ────────────────────────────────────
async function generateJudgment(taskText, passed) {
  const mood = passed 
    ? 'celebrate them sarcastically' 
    : 'mock them gently and encourage them';

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'user',
        content: `The user was given this task: "${taskText}".
They ${passed ? 'completed' : 'failed'} it.
Write one short funny sentence to ${mood}. 
Return only that sentence.`
      }
    ],
    max_tokens: 60,
    temperature: 0.8,
  });

  return response.choices[0].message.content.trim();
}


module.exports = { generateTask, verifyImage, generateJudgment };
