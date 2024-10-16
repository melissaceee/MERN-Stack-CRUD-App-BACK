const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isRegistered } = require('../middleware/authentication');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/order', isAuthenticated, isRegistered, userController.placeOrder);

module.exports = router;
