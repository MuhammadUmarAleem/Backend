const express = require('express');
const router = express.Router();
const Controller = require('../../controller/RegAndAuth/EditProfile');

// Route to send the verification email
router.post('/', Controller.EditProfile);

module.exports = router;
