var express = require("express");
var router = express.Router();
const controller = require("../../controller/ProjectManager/CreateTicket");

router.post("/", controller.CreateTicket);

module.exports = router;
