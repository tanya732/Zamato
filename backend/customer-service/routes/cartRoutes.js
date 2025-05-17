const express = require('express');
const { addItemToCart } = require('../controllers/cartController');
const authInterceptor = require('../middleware/authInterceptor');  // Correct path

const router = express.Router();

router.use(authInterceptor);

router.post('/add', addItemToCart);

module.exports = router;
