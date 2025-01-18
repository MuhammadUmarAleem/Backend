const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/GetProfile');

// Route to send the verification email
router.get('/:userId', Controller.GetProfile);

module.exports = router;
