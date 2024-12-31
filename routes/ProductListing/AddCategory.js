const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/AddCategory');

// Route to send the verification email
router.post('/', Controller.AddCategory);

module.exports = router;
