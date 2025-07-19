const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'supersecurekey'; // must match vote.js

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

    res.json({ msg: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

module.exports = router;
