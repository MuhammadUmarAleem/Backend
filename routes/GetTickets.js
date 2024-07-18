var express = require("express");
var router = express.Router();
const controller = require("../controller/GetTickets");

router.get("/", controller.GetTickets);

module.exports = router;
