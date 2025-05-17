const cartDao = require('../dao/cartDao');

const createCartForUser = async (userId) => {
  return await cartDao.createCart(userId);
};

const addItemToUserCart = async (userId, foodItem, quantity, price) => {
  let cart = await cartDao.findCartByUserId(userId);
  if (!cart) cart = await createCartForUser(userId);
  
  return await cartDao.addItemToCart(cart.id, foodItem, quantity, price);
};

module.exports = { createCartForUser, addItemToUserCart };
