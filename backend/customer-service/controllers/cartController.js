const cartService = require('../services/cartService');

const addItemToCart = async (req, res) => {
  try {
    const { userId, foodItem, quantity, price } = req.body;
    const cartItem = await cartService.addItemToUserCart(userId, foodItem, quantity, price);
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addItemToCart };
