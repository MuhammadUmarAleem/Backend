var express = require("express");
var router = express.Router();
const controller = require("../controller/GetPMDashboard");

router.get("/", controller.GetPMDashboard);

module.exports = router;
