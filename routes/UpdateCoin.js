var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateCoin");

router.post("/", controller.UpdateCoin);

module.exports = router;
