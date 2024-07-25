var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/AddAdmin");

router.put("/", controller.AddAdmin);

module.exports = router;
