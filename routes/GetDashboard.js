var express = require("express");
var router = express.Router();
const controller = require("../controller/GetDashboard");

router.get("/", controller.GetDashboard);

module.exports = router;
