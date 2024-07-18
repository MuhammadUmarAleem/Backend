var express = require("express");
var router = express.Router();
const controller = require("../controller/GetEmployeeUsingId");

router.get("/", controller.GetEmployeesUsingId);

module.exports = router;
