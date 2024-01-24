var express = require("express");
var router = express.Router();
const controller = require("../controller/Plan");

router.post("/", controller.Plan);

module.exports = router;
