const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/Login');

// Route to send the verification email
router.post('/', Controller.Login);

module.exports = router;
