const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/UpdateUser');

router.put('/:userId', Controller.UpdateUser);

module.exports = router;
