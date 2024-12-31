const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/RegisterSeller');

// Route to send the verification email
router.post('/', Controller.RegisterSeller);

module.exports = router;
