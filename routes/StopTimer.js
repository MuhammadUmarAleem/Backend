var express = require("express");
var router = express.Router();
const controller = require("../controller/StopTimer");

router.put("/", controller.StopTimer);

module.exports = router;