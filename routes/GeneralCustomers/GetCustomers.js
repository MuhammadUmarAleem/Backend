const express = require('express');
const router = express.Router();
const Controller = require('../../controller/GeneralCustomers/GetCustomers');

// Route to send the verification email
router.get('/:sellerId', Controller.GetCustomers);

module.exports = router;
