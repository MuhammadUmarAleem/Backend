const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Inventory/UpdateStock');

// Route to send the verification email
router.put('/:productId', Controller.UpdateStock);

module.exports = router;
