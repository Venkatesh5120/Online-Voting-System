const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const Vote = require('../models/Vote');

// Add candidate to election (admin only)
router.post('/', adminAuth, async (req, res) => {
  console.log('POST /api/candidates hit'); // Debugging log
  try {
    const { name, description, electionId } = req.body;

    // Validate input
    if (!name || !description || !electionId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the election exists
    const election = await Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Create the candidate
    const candidate = await Candidate.create({
      name,
      description,
      election_id: electionId, // Ensure this matches the database schema
    });

    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

// Vote for a candidate
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const candidateId = req.params.id;
    const userId = req.user.id; // Extract user_id from the authenticated user

    console.log('Candidate ID:', candidateId);
    console.log('User ID:', userId);

    // Check if the candidate exists
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      console.log('Candidate not found');
      return res.status(404).json({ error: 'Candidate not found' });
    }

    console.log('Candidate found:', candidate.name);

    // Check if the election is active
    const election = await Election.findByPk(candidate.election_id);
    const now = new Date();
    if (!election || now < election.start_date || now > election.end_date) {
      console.log('Election is not active');
      return res.status(400).json({ error: 'Election is not active' });
    }

    console.log('Election is active:', election.title);

    // Check if the user has already voted in this election
    const existingVote = await Vote.findOne({
      where: { user_id: userId, election_id: candidate.election_id },
    });
    if (existingVote) {
      console.log('User has already voted');
      return res.status(400).json({ error: 'You have already voted in this election' });
    }

    console.log('User has not voted yet');

    // Record the vote
    const vote = await Vote.create({
      user_id: userId,
      election_id: candidate.election_id,
      candidate_id: candidateId,
    });

    console.log('Vote recorded successfully:', vote);

    // Increment the candidate's vote count
    await candidate.increment('voteCount');
    console.log('Vote count incremented for candidate:', candidate.name);

    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// Get candidates for an election
router.get('/election/:electionId', auth, async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      where: {
        election_id: req.params.electionId
      },
      attributes: ['id', 'name', 'description', 'voteCount']
    });

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

module.exports = router;