const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/PasswordResetSession');

// Route to send the verification email
router.post('/', Controller.PasswordResetSession);

module.exports = router;
