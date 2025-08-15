const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// Cast vote
router.post('/', auth, async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const election = await Election.findByPk(electionId);
    const candidate = await Candidate.findByPk(candidateId);

    if (!election || !candidate) {
      return res.status(404).json({ error: 'Election or candidate not found' });
    }

    // Check if election is active
    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return res.status(400).json({ error: 'Election is not active' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      where: {
        userId: req.user.id,
        electionId
      }
    });

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted in this election' });
    }

    // Create vote
    const vote = await Vote.create({
      userId: req.user.id,
      electionId,
      candidateId
    });

    // Update candidate vote count
    await candidate.increment('voteCount');

    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's votes
router.get('/my-votes', auth, async (req, res) => {
  try {
    const votes = await Vote.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Election,
          attributes: ['title', 'description']
        },
        {
          model: Candidate,
          attributes: ['name']
        }
      ]
    });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 