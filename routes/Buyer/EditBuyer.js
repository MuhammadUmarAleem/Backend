const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Buyer/EditBuyer');

router.put('/:userId', Controller.EditBuyer);

module.exports = router;
