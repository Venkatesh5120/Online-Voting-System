const User = require('../models/User');

async function checkUsers() {
  try {
    const users = await User.findAll();
    console.log('Existing users:', users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email
    })));
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();

fetch('http://localhost:5000/api/auth/debug/user/test123@example.com')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error)); 