const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/DuplicateProduct');

// Route to send the verification email
router.post('/:productId', Controller.DuplicateProduct);

module.exports = router;
