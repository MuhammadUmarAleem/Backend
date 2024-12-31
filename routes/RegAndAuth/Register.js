const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/Register');

// Route to send the verification email
router.post('/', Controller.Register);

module.exports = router;
