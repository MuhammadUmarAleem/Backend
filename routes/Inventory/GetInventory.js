const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Inventory/GetInventory');

// Route to send the verification email
router.get('/:sellerId', Controller.GetInventory);

module.exports = router;
