var express = require("express");
var router = express.Router();
const controller = require("../controller/Bot");

router.post("/", controller.Bot);

module.exports = router;
