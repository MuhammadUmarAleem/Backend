var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/UpdateLeaveRequest");

router.put("/", controller.UpdateLeaveRequest);

module.exports = router;