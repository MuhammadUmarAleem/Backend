var express = require("express");
var router = express.Router();
const controller = require("../controller/AssignProject");

router.post("/", controller.AssignProject);

module.exports = router;
