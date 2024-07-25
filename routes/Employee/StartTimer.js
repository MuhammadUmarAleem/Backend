var express = require("express");
var router = express.Router();
const controller = require("../../controller/Employee/StartTimer");

router.post("/", controller.StartTimer);

module.exports = router;