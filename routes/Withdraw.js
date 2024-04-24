var express = require("express");
var router = express.Router();
const controller = require("../controller/Withdraw");

router.post("/", controller.Withdraw);

module.exports = router;
