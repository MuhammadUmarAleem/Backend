var express = require("express");
var router = express.Router();
const controller = require("../controller/Lottery");

router.post("/", controller.Lottery);

module.exports = router;
