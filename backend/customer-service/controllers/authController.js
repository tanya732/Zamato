const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log("signup req body : ", req.body)
    const user = await authService.signup(email, password, name);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login };
