var express = require("express");
var router = express.Router();
const controller = require("../controller/GetAttendance");

router.get("/", controller.GetAttendance);

module.exports = router;
