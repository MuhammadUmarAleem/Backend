var express = require("express");
var router = express.Router();
const controller = require("../controller/GetTicket");

router.get("/", controller.GetTicket);

module.exports = router;
