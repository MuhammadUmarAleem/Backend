const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/UpdateAvailability');

router.put('/', Controller.UpdateAvailability);

module.exports = router;
