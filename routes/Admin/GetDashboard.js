const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/GetDashoboard');

router.get('/', Controller.GetDashboard);

module.exports = router;
