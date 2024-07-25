var express = require("express");
var router = express.Router();
const controller = require("../../controller/Admin/CreateProject");

router.post("/", controller.CreateProject);

module.exports = router;
