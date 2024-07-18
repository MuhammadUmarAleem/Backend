var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteEmployee");

router.delete("/", controller.DeleteEmployee);

module.exports = router;
