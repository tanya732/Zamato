const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authDao = require('../dao/authDao');

const signup = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await authDao.createUser(email, hashedPassword, name);
  console.log("User Created : ", user);
  return user;
};

const login = async (email, password) => {
  const user = await authDao.findUserByEmail(email);
  if (!user) throw new Error('User not found');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token };
};

module.exports = { signup, login };
