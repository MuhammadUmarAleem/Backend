const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/GetUsers');

router.get('/', Controller.GetUsers);

module.exports = router;
