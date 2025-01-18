const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/GetOrganizations');

router.get('/', Controller.GetOrganizations);

module.exports = router;
