import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [editElection, setEditElection] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchElections();
  }, [user, navigate]);

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/elections', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setElections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch elections error:', error);
      setError(
        error.response?.data?.error || 
        `Failed to fetch elections: ${error.message}`
      );
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const formattedElection = {
        title: newElection.title,
        description: newElection.description,
        start_date: new Date(newElection.startDate).toISOString(),
        end_date: new Date(newElection.endDate).toISOString(),
        status: 'upcoming'
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/elections', formattedElection, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess('Election created successfully');
      setNewElection({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
      });
      fetchElections();
    } catch (error) {
      console.error('Error creating election:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to create election');
    }
  };

  const handleEditClick = (election) => {
    setEditElection({
      ...election,
      startDate: election.start_date ? new Date(election.start_date).toISOString().slice(0, 16) : '',
      endDate: election.end_date ? new Date(election.end_date).toISOString().slice(0, 16) : ''
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const formattedElection = {
        title: editElection.title,
        description: editElection.description,
        start_date: new Date(editElection.startDate).toISOString(),
        end_date: new Date(editElection.endDate).toISOString(),
        status: editElection.status
      };

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/elections/${editElection.id}`, formattedElection, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Election updated successfully');
      setOpenEditDialog(false);
      fetchElections();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update election');
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Election
        </Typography>
        <form onSubmit={handleCreateElection}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newElection.title}
                onChange={(e) =>
                  setNewElection({ ...newElection, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newElection.description}
                onChange={(e) =>
                  setNewElection({ ...newElection, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={newElection.startDate}
                onChange={(e) =>
                  setNewElection({ ...newElection, startDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={newElection.endDate}
                onChange={(e) =>
                  setNewElection({ ...newElection, endDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Election
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Manage Elections
      </Typography>
      <Grid container spacing={3}>
        {elections.map((election) => (
          <Grid item xs={12} key={election.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">{election.title}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {election.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {election.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Start Date: {election.start_date ? new Date(election.start_date).toLocaleString() : 'Not set'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                End Date: {election.end_date ? new Date(election.end_date).toLocaleString() : 'Not set'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => navigate(`/elections/${election.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleEditClick(election)}
                >
                  Edit
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Edit Election Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Election</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={editElection?.title || ''}
                onChange={(e) =>
                  setEditElection({ ...editElection, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editElection?.description || ''}
                onChange={(e) =>
                  setEditElection({ ...editElection, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={editElection?.startDate || ''}
                onChange={(e) =>
                  setEditElection({ ...editElection, startDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={editElection?.endDate || ''}
                onChange={(e) =>
                  setEditElection({ ...editElection, endDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 