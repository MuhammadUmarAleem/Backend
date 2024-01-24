var express = require("express");
var router = express.Router();
const controller = require("../controller/Subscribe");

router.post("/", controller.Subscribe);

module.exports = router;
