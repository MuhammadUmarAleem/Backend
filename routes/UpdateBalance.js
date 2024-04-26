var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateBalance");

router.post("/", controller.UpdateBalance);

module.exports = router;
