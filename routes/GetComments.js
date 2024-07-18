var express = require("express");
var router = express.Router();
const controller = require("../controller/GetComments");

router.get("/", controller.GetComments);

module.exports = router;
