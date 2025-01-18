const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SubscriptionPlan/DeleteSubscriptionPlan');

router.delete('/:planId', Controller.DeleteSubscriptionPlan);

module.exports = router;
