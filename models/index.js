// filepath: d:\OVS\models\index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {
  Election: require('./Election'),
  Candidate: require('./Candidate')
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;