var express = require("express");
var router = express.Router();
const controller = require("../controller/GetEmployeeRequests");

router.get("/", controller.GetEmployeeRequests);

module.exports = router;
