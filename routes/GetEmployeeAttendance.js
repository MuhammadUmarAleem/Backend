var express = require("express");
var router = express.Router();
const controller = require("../controller/GetEmployeeAttendance");

router.get("/", controller.GetEmployeeAttendance);

module.exports = router;
