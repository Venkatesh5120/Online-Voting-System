const { Election, Candidate } = require('./models');

// Fetch an election with its candidates
async function fetchElectionWithCandidates(electionId) {
  const election = await Election.findOne({
    where: { id: electionId },
    include: [{ model: Candidate, as: 'Candidates' }]
  });
  console.log(JSON.stringify(election, null, 2));
}

// Fetch a candidate with its election
async function fetchCandidateWithElection(candidateId) {
  const candidate = await Candidate.findOne({
    where: { id: candidateId },
    include: [{ model: Election, as: 'Election' }]
  });
  console.log(JSON.stringify(candidate, null, 2));
}

// Example usage
(async () => {
  await fetchElectionWithCandidates(1); // Replace 1 with a valid election ID
  await fetchCandidateWithElection(1); // Replace 1 with a valid candidate ID
})();