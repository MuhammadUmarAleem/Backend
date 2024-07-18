var express = require("express");
var router = express.Router();
const controller = require("../controller/GetAssignedTicket");

router.get("/", controller.GetAssignedTicket);

module.exports = router;
