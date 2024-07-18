var express = require("express");
var router = express.Router();
const controller = require("../controller/GetTeams");

router.get("/", controller.GetTeams);

module.exports = router;
