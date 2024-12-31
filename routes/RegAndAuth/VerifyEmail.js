const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/VerifyEmail');

// Route to send the verification email
router.get('/:uuid', Controller.VerifyEmail);

module.exports = router;
