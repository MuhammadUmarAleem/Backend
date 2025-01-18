const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/DeleteUser');

router.delete('/:userId', Controller.DeleteUser);

module.exports = router;
