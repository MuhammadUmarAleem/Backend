const express = require('express');
const router = express.Router();
const Controller = require('../../controller/UserSubscription/AddUserSubscription');

router.post('/', Controller.AddUserSubscription);
router.get('/', Controller.PaymentSuccess);


module.exports = router;
