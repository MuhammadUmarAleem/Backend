var express = require("express");
var router = express.Router();
const controller = require("../controller/GetProject");

router.get("/", controller.GetProject);

module.exports = router;
