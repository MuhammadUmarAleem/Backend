var express = require("express");
var router = express.Router();
const controller = require("../controller/register");

router.post("/", controller.Register);

module.exports = router;
