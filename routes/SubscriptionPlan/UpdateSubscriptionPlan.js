const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SubscriptionPlan/UpdateSubscriptionPlan');
router.put('/', Controller.UpdateSubscriptionPlan);

module.exports = router;
