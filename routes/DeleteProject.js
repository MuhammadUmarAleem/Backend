var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteProject");

router.delete("/", controller.DeleteProject);

module.exports = router;
