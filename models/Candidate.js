const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  election_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'elections',
      key: 'id'
    }
  },
  voteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false // Disable automatic `createdAt` and `updatedAt` fields
});

// Define associations
Candidate.associate = (models) => {
  Candidate.belongsTo(models.Election, {
    foreignKey: 'election_id',
    as: 'Election'
  });
};

module.exports = Candidate;