var express = require("express");
var router = express.Router();
const controller = require("../controller/GetEmployees");

router.get("/", controller.GetEmployees);

module.exports = router;
