const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

router.get('/car', checkAuth, ProductController.queryAllCars);

router.post('/', checkAuth, ProductController.create_product);

router.get('/', ProductController.get_all_products);

router.get('/:id', ProductController.get_product_by_id);

router.patch('/:id', checkAuth, ProductController.modify_product);

router.delete('/:id', checkAuth, ProductController.delete_product);

module.exports = router;
