var express = require("express");
var router = express.Router();
const controller = require("../controller/GetStats");

router.get("/", controller.GetStats);

module.exports = router;
