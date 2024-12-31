const express = require('express');
const router = express.Router();
const Controller = require('../../controller/GeneralCustomers/GetCustomersDetails');

// Route to send the verification email
router.get('/:userId/:sellerId', Controller.GetCustomersDetails);

module.exports = router;