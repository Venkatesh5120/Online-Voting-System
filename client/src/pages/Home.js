import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold' }}
        >
          Welcome to Online Voting System
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          color="textSecondary"
        >
          Secure and Transparent Voting Platform
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Secure Voting
            </Typography>
            <Typography variant="body1" paragraph>
              Our platform ensures secure and anonymous voting with advanced
              encryption and authentication mechanisms.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Real-time Results
            </Typography>
            <Typography variant="body1" paragraph>
              Get instant access to election results as soon as voting ends,
              with transparent vote counting.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Easy Management
            </Typography>
            <Typography variant="body1" paragraph>
              Administrators can easily create and manage elections with our
              intuitive dashboard.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        {!user ? (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/login"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/register"
            >
              Register
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/elections"
          >
            View Elections
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Home; 