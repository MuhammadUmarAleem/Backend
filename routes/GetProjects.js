var express = require("express");
var router = express.Router();
const controller = require("../controller/GetProjects");

router.get("/", controller.GetProjects);

module.exports = router;
