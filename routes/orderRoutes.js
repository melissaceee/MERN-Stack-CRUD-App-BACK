const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isRegistered } = require('../middleware/authentication');

router.post('/add-item', isAuthenticated, isRegistered, orderController.addItemToOrder);
router.delete('/remove-item', isAuthenticated, isRegistered, orderController.removeItemFromOrder);
router.get('/current-order', isAuthenticated, isRegistered, orderController.getOrder);

module.exports = router;
