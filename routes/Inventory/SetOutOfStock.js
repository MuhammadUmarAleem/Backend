const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Inventory/SetOutOfStock');

// Route to send the verification email
router.put('/:productId', Controller.SetOutOfStock);

module.exports = router;
