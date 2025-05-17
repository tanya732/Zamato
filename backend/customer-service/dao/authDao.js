const db = require('../db');

const findUserByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const createUser = async (email, password, name) => {
  const res = await db.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
    [email, password, name]
  );
  return res.rows[0];
};

module.exports = { findUserByEmail, createUser };
