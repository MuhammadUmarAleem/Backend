var express = require("express");
var router = express.Router();
const controller = require("../controller/GetPlans");

router.get("/", controller.GetPlans);

module.exports = router;
