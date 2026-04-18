const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

// POST /api/session/start
router.post('/start', (req, res) => {
  const sessionId = uuidv4();
  
  try {
    const stmt = db.prepare('INSERT INTO users (session_id) VALUES (?)');
    stmt.run(sessionId);

    console.log(`[Session] Started & Persistent: ${sessionId}`);
    res.json({
      sessionId,
      score: 0,
      tasksCompleted: 0
    });
  } catch (error) {
    console.error('[Session Start Error]:', error.message);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// GET /api/session/leaderboard
// Returns top 10 users by total_score
router.get('/leaderboard', (req, res) => {
  try {
    const stmt = db.prepare('SELECT session_id, name, total_score, tasks_completed FROM users ORDER BY total_score DESC LIMIT 10');
    const leaderboard = stmt.all();
    res.json(leaderboard);
  } catch (error) {
    console.error('[Leaderboard Error]:', error.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/session/:sessionId
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const stmt = db.prepare('SELECT session_id, total_score as score, tasks_completed FROM users WHERE session_id = ?');
    const user = stmt.get(sessionId);

    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('[Session Get Error]:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/session/:sessionId/update
router.post('/:sessionId/update', (req, res) => {
  const { sessionId } = req.params;
  const { score, tasksCompleted, name } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE session_id = ?').get(sessionId);
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const updates = [];
    const params = [];

    if (score !== undefined) {
      updates.push('total_score = ?');
      params.push(score);
    }
    if (tasksCompleted !== undefined) {
      updates.push('tasks_completed = ?');
      params.push(tasksCompleted);
    }
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }

    if (updates.length > 0) {
      params.push(sessionId);
      const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE session_id = ?`);
      stmt.run(...params);
    }

    const updatedUser = db.prepare('SELECT session_id, total_score as score, tasks_completed, name FROM users WHERE session_id = ?').get(sessionId);
    res.json(updatedUser);

  } catch (error) {
    console.error('[Session Update Error]:', error.message);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

module.exports = router;
