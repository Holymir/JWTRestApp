const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrderController = require('../controllers/orders');

router.post('/', checkAuth, OrderController.create_order);

router.get('/', checkAuth, OrderController.get_all_orders);

router.get('/:id', checkAuth, OrderController.get_order_by_id);

router.delete('/:id', checkAuth, OrderController.delete_order);

module.exports = router;
