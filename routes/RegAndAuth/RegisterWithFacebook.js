const express = require('express');
const router = express.Router();
const { FacebookLogin, FacebookCallback } = require('../../controller/RegAndAuth/RegisterWithFacebook');

// Route to initiate Google login
router.get('/', FacebookLogin);

// Route to handle the callback from Google
router.get('/callback', FacebookCallback);

module.exports = router;
