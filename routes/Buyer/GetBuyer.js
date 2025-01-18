const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Buyer/GetBuyer');

router.get('/:userId', Controller.GetBuyer);

module.exports = router;
