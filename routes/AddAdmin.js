var express = require("express");
var router = express.Router();
const controller = require("../controller/AddAdmin");

router.put("/", controller.AddAdmin);

module.exports = router;
