var express = require("express");
var router = express.Router();
const controller = require("../controller/CreateComment");

router.post("/", controller.CreateComment);

module.exports = router;
