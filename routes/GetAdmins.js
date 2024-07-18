var express = require("express");
var router = express.Router();
const controller = require("../controller/GetAdmins");

router.get("/", controller.GetAdmins);

module.exports = router;
