const express = require('express');
const router = express.Router();
const { GoogleLogin, GoogleCallback } = require('../../controller/RegAndAuth/RegisterWithGoogle');

// Route to initiate Google login
router.get('/', GoogleLogin);

// Route to handle the callback from Google
router.get('/callback', GoogleCallback);

module.exports = router;
