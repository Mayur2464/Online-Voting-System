// routes/vote.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vote = require('../models/Vote');

// ✅ Must match auth.js
const SECRET = 'supersecurekey';

// ✅ Vote submission route
router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  const { party } = req.body;

  try {
    // ✅ Check if token exists in Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET); // Use correct secret key
    const user = await User.findById(decoded.userId); // Use userId from payload

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // ✅ Check if user already voted
    const alreadyVoted = await Vote.findOne({ userId: user._id });
    if (alreadyVoted) {
      return res.status(400).json({ msg: "You have already voted" });
    }

    // ✅ Save vote
    const vote = new Vote({ userId: user._id, party });
    await vote.save();

    res.json({ msg: "Vote submitted successfully" });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ msg: "Server error while voting" });
  }
});

// ✅ Voting results route
router.get('/results', async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $group: { _id: "$party", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error("Results error:", err);
    res.status(500).json({ msg: "Server error while fetching results" });
  }
});

module.exports = router;
