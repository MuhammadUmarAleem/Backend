var express = require("express");
var router = express.Router();
const controller = require("../controller/StartTimer");

router.post("/", controller.StartTimer);

module.exports = router;