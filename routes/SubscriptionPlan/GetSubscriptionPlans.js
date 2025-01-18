const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SubscriptionPlan/GetSubscriptionPlans');
router.get('/', Controller.GetSubscriptionPlans);

module.exports = router;
