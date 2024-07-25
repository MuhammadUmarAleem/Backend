var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/CreateTeam");

router.post("/", controller.CreateTeam);

module.exports = router;
