const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await sequelize.query(`
      INSERT INTO users (username, email, password, role, createdAt, updatedAt)
      VALUES ('admin', 'admin@example.com', ?, 'admin', NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      password = VALUES(password),
      updatedAt = NOW()
    `, {
      replacements: [hashedPassword]
    });

    console.log('Admin user created/updated successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin(); 