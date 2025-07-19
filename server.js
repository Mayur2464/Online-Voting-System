const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');

const app = express();
const PORT = 5000;

// ✅ MongoDB Connection
// Use URL-encoded password if it contains special characters
const MONGO_URI = 'mongodb+srv://voteradmin:OVS%40project@votingcluster.3dipx7r.mongodb.net/votingdb?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit server if DB connection fails
  });

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vote', voteRoutes);

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve FE.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'FE.html'));
});

// ✅ Optional: SPA catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'FE.html'));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
