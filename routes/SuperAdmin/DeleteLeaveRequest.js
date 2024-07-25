var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/DeleteLeaveRequest");

router.delete("/", controller.DeleteLeaveRequest);

module.exports = router;
