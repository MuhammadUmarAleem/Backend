var express = require("express");
var router = express.Router();
const controller = require("../../controller/ProjectManager/UpdateLeaveRequest1");

router.put("/", controller.UpdateLeaveRequest1);

module.exports = router;