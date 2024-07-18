var express = require("express");
var router = express.Router();
const controller = require("../controller/CreateLeaveRequest");

router.post("/", controller.CreateLeaveRequest);

module.exports = router;
