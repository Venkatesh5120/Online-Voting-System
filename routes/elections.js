const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// Helper function to determine election status
const getElectionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};

// Create election (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const election = await Election.create({
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: getElectionStatus(req.body.start_date, req.body.end_date),
      created_by: req.user.id
    });
    
    // Fetch the created election with candidates
    const createdElection = await Election.findByPk(election.id, {
      include: [{
        model: Candidate,
        as: 'Candidates',
        attributes: ['id', 'name', 'description', 'voteCount']
      }]
    });
    
    res.status(201).json(createdElection);
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all elections
router.get('/', auth, async (req, res) => {
  try {
    const elections = await Election.findAll({
      include: [{
        model: Candidate,
        as: 'Candidates',
        attributes: ['id', 'name', 'description', 'voteCount'],
        required: false
      }],
      order: [['created_at', 'DESC']]
    });

    // Update status for each election based on current time
    const updatedElections = await Promise.all(elections.map(async (election) => {
      const currentStatus = getElectionStatus(election.start_date, election.end_date);
      if (currentStatus !== election.status) {
        await election.update({ status: currentStatus });
      }
      return { ...election.toJSON(), status: currentStatus };
    }));

    res.json(updatedElections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

// Get single election
router.get('/:id', auth, async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id, {
      include: [{
        model: Candidate,
        as: 'Candidates',
        attributes: ['id', 'name', 'description', 'voteCount'],
      }],
    });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.json(election);
  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({ error: 'Failed to fetch election' });
  }
});

// Update election (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status
    };

    await election.update(updateData);
    
    // Fetch updated election with candidates
    const updatedElection = await Election.findByPk(req.params.id, {
      include: [{
        model: Candidate,
        as: 'Candidates',
        attributes: ['id', 'name', 'description', 'voteCount']
      }]
    });

    res.json(updatedElection);
  } catch (error) {
    console.error('Error updating election:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete election (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }
    await election.destroy();
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;