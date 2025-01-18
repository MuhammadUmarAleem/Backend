const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/GetAllUsers');

router.get('/', Controller.GetAllUsers);

module.exports = router;
