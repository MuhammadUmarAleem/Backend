const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/ToogleProductStatus');

router.put('/:productId', Controller.ToggleProductStatus);

module.exports = router;
