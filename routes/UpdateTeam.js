var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateTeam");

router.put("/", controller.UpdateTeam);

module.exports = router;