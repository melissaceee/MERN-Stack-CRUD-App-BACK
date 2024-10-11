const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { isAuthenticated, isRegistered, isAdmin } = require('../middleware/authentication');

router.post('/create', isAuthenticated, isRegistered, isAdmin, menuController.createItem);
router.get('/getitems', menuController.getAllItems);
router.get('/search/:itemname', menuController.getItemByName);
router.put('/:id', isAuthenticated, isRegistered, isAdmin, menuController.updateItem);
router.delete('/:id', isAuthenticated, isRegistered, isAdmin, menuController.deleteItem);

module.exports = router;
