// filepath: d:\OVS\controllers\electionController.js
const { Election, Candidate } = require('../models');

exports.getElectionWithCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findOne({
      where: { id: electionId },
      include: [{ model: Candidate, as: 'Candidates' }]
    });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.status(200).json(election);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch election with candidates' });
  }
};