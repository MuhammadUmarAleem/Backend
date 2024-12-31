const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/AddProduct');

// Route to send the verification email
router.post('/', Controller.AddProduct);

module.exports = router;
