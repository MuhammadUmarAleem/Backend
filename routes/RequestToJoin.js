var express = require("express");
var router = express.Router();
const controller = require("../controller/RequestToJoin");

router.post("/", controller.RequestToJoin);

module.exports = router;
