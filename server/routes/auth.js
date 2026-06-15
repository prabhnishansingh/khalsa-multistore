const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /login
 * Accepts { username, password }, validates credentials,
 * and returns a JWT token (expires in 24h) with user info.
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isValidPassword = bcrypt.compareSync(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /verify
 * Protected route. Returns { valid: true, user: req.user }
 * if the token is valid.
 */
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
