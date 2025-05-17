const db = require('../db');

const createCart = async (userId) => {
  const res = await db.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
    [userId]
  );
  return res.rows[0];
};

const findCartByUserId = async (userId) => {
  const res = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  return res.rows[0];
};

const addItemToCart = async (cartId, foodItem, quantity, price) => {
  const res = await db.query(
    'INSERT INTO cart_items (cart_id, food_item, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
    [cartId, foodItem, quantity, price]
  );
  return res.rows[0];
};

module.exports = { createCart, findCartByUserId, addItemToCart };
