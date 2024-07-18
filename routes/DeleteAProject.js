var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteAProject");

router.delete("/", controller.DeleteAProject);

module.exports = router;
