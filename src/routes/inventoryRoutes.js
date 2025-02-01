const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventoryController');
router.post('/users/:user_id/buy', inventoryController.buyItem);
router.put('/users/:user_id/pets/:pet_id/use', inventoryController.useItem);




module.exports = router;
