var express = require("express");
var router = express.Router();
const controller = require("../controller/GetLottery");

router.get("/", controller.GetLottery);

module.exports = router;
