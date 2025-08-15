const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a connection without specifying a database
const sequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});

async function initializeDatabase() {
  try {
    // Create the database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('Database created or already exists');
    
    // Close the connection
    await sequelize.close();
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase(); 