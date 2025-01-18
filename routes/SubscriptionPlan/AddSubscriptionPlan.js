const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SubscriptionPlan/AddSubscriptionPlan');

router.post('/', Controller.AddSubscriptionPlan);


module.exports = router;
