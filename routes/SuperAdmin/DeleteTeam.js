var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/DeleteTeam");

router.delete("/", controller.DeleteTeam);

module.exports = router;
