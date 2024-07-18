var express = require("express");
var router = express.Router();
const controller = require("../controller/GetProjectsCompleted");

router.get("/", controller.GetProjectsCompleted);

module.exports = router;
