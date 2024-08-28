var express = require("express");
var router = express.Router();
const controller = require("../controller/AddChat");

router.post("/", controller.AddChat);

module.exports = router;
