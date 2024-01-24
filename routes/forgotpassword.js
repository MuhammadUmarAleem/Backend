var express = require("express");
var router = express.Router();
const controller = require("../controller/forgotpassword");

router.post("/", controller.forgotpassword);

module.exports = router;
