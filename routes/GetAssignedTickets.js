var express = require("express");
var router = express.Router();
const controller = require("../controller/GetAssignedTickets");

router.get("/", controller.GetAssignedTickets);

module.exports = router;
