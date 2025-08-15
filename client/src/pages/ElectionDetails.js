import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import axios from 'axios';

const ElectionDetails = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchElection = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view election details');
        setLoading(false);
        return;
      }

      console.log('Fetching election details...');
      const response = await axios.get(`http://localhost:5000/api/elections/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Election data:', response.data);
      setElection(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching election details:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to fetch election details');
      setLoading(false); // Ensure loading is set to false even on error
    }
  }, [id]);

  useEffect(() => {
    fetchElection();
  }, [fetchElection]);

  const handleVote = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to cast your vote');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/candidates/${candidateId}/vote`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(response.data.message);
      fetchElection(); // Refresh election data to update vote counts
    } catch (error) {
      console.error('Error casting vote:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to cast vote');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!election) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Election not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {election.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {election.description}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Status: {election.status}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Start Date: {election.start_date ? new Date(election.start_date).toLocaleString() : 'Not set'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          End Date: {election.end_date ? new Date(election.end_date).toLocaleString() : 'Not set'}
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Candidates
        </Typography>
        <Grid container spacing={3}>
          {election.Candidates.map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{candidate.name}</Typography>
                  <Typography>{candidate.description}</Typography>
                  <Typography>Votes: {candidate.voteCount}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleVote(candidate.id)}
                  >
                    Vote
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ElectionDetails;