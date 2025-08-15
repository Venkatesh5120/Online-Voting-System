const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('Verifying token with secret:', process.env.JWT_SECRET); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await User.findByPk(decoded.id);
    console.log('Found user:', user ? 'Yes' : 'No'); // Debug log

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;

    // Check if the request is for voting
    if (req.method === 'POST' && req.path.includes('/vote')) {
      const candidateId = req.params.id;

      // Find the candidate and increment the vote count
      const candidate = await Candidate.findByPk(candidateId);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      await candidate.increment('voteCount');
      console.log(`Vote count updated for candidate ID: ${candidateId}`);
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = { auth, adminAuth };