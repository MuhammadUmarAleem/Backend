var express = require("express");
var router = express.Router();
const controller = require("../controller/AddMessage");

router.post("/", controller.AddMessage);

module.exports = router;
