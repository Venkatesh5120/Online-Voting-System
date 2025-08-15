import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view elections');
        setLoading(false);
        return;
      }

      console.log('Fetching elections with token:', token); // Debug log
      const response = await axios.get('http://localhost:5000/api/elections', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Elections response:', response.data); // Debug log
      setElections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching elections:', error.response || error); // Enhanced error logging
      if (error.response?.status === 401) {
        setError('Please login to view elections');
      } else {
        setError(error.response?.data?.error || 'Failed to fetch elections');
      }
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'completed':
        return 'default';
      default:
        return 'default';
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
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Elections
      </Typography>
      {elections.length === 0 ? (
        <Typography>No elections available at the moment.</Typography>
      ) : (
        <Grid container spacing={3}>
          {elections.map((election) => (
            <Grid item xs={12} sm={6} md={4} key={election.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {election.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {election.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={election.status}
                      color={getStatusColor(election.status)}
                      size="small"
                    />
                  </Box>
                  <Button
                    component={RouterLink}
                    to={`/elections/${election.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Elections; 