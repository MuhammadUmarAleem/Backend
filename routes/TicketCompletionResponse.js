var express = require("express");
var router = express.Router();
const controller = require("../controller/TicketCompletionResponse");

router.put("/", controller.TicketCompletionResponse);

module.exports = router;