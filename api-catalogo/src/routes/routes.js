const express = require('express');
const router = express.Router();

// import SessionController from './app/controllers/SessionController';
const productController = require('../controllers/productController');

// Add routes
router.get('/products/:id', productController.getProduct);
// routes.get('/', SessionController.store);
// routes.post('/', SessionController.store);
// routes.put('/', SessionController.store);
// routes.delete('/', SessionController.store);

module.exports = router;