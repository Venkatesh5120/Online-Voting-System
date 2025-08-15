const sequelize = require('./config/database');
const User = require('./models/User');
const Election = require('./models/Election');
const Candidate = require('./models/Candidate');
const Vote = require('./models/Vote');
const bcrypt = require('bcryptjs');

// Define associations
Election.hasMany(Candidate, {
  foreignKey: 'election_id',
  as: 'Candidates'
});

Candidate.belongsTo(Election, {
  foreignKey: 'election_id',
  as: 'Election'
});

User.hasMany(Vote, {
  foreignKey: 'user_id',
  as: 'Votes'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'User'
});

Vote.belongsTo(Election, {
  foreignKey: 'election_id',
  as: 'Election'
});

Vote.belongsTo(Candidate, {
  foreignKey: 'candidate_id',
  as: 'Candidate'
});

const createAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const now = new Date();
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      created_at: now,
      updated_at: now
    });
    console.log('Admin user created successfully');
    console.log('Admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const syncDatabase = async () => {
  try {
    // Sync all models
    await sequelize.sync({ force: true }); // This will drop and recreate all tables
    console.log('Database synchronized successfully');
    
    // Create admin user
    await createAdminUser();
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    process.exit();
  }
};

syncDatabase(); 