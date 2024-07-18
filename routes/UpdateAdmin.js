var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateAdmin");

router.put("/", controller.UpdateAdmin);

module.exports = router;