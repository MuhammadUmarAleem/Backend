var express = require("express");
var router = express.Router();
const controller = require("../../controller/ProjectManager/TicketCompletionResponse");

router.put("/", controller.TicketCompletionResponse);

module.exports = router;