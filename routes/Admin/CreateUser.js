const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/CreateUser');

router.post('/', Controller.CreateUser);

module.exports = router;
