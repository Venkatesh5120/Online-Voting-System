const sequelize = require('../config/database');
const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

async function syncDatabase() {
  try {
    // Sync all models
    await sequelize.sync({ force: false }); // Set force to true to drop tables and recreate them
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase(); 