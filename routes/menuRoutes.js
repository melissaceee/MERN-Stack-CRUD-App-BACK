const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController'); 


router.post('/create', menuController.createItem); 
router.get('/getitems', menuController.getAllItems);
router.get('/search/:itemname', menuController.getItemByName); 
router.put('/:id', menuController.updateItem);
router.delete('/menu/:id', menuController.deleteItem);

module.exports = router;
