var express = require("express");
var router = express.Router();
const controller = require("../../controller/ProjectManager/CreateComment");

router.post("/", controller.CreateComment);

module.exports = router;
