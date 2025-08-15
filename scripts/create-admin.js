const User = require('../models/User');
const Election = require('../models/Election');
const Vote = require('../models/Vote');
const sequelize = require('../config/database');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Delete existing user if any
    const existingUser = await User.findOne({ where: { email: 'test123@example.com' } });
    if (existingUser) {
      console.log('Found existing user:', existingUser.email);
      
      // First delete all votes associated with this user
      await Vote.destroy({ where: { user_id: existingUser.id } });
      console.log('Deleted associated votes');
      
      // Then delete all elections created by this user
      await Election.destroy({ where: { created_by: existingUser.id } });
      console.log('Deleted associated elections');
      
      // Now we can delete the user
      await existingUser.destroy();
      console.log('Deleted existing user');
    }

    // Create new admin user
    const admin = await User.create({
      username: 'test123',
      email: 'test123@example.com',
      password: 'yourpassword123',
      role: 'admin'
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      passwordHash: admin.password
    });

    // Verify password
    const isValid = await admin.validatePassword('yourpassword123');
    console.log('Password verification test:', isValid);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdmin(); 