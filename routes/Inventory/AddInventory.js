const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Inventory/AddInventory');

// Route to send the verification email
router.post('/', Controller.AddInventory);

module.exports = router;
