var express = require("express");
var router = express.Router();
const controller = require("../../controller/ProjectManager/AssignProject");

router.post("/", controller.AssignProject);

module.exports = router;
