const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Inventory/GetLowStockInventory');

// Route to send the verification email
router.get('/:sellerId', Controller.GetLowStockInventory);

module.exports = router;
