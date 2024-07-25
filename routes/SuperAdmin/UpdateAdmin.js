var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/UpdateAdmin");

router.put("/", controller.UpdateAdmin);

module.exports = router;