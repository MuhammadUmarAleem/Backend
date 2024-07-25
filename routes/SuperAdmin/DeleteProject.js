var express = require("express");
var router = express.Router();
const controller = require("../../controller/SuperAdmin/DeleteProject");

router.delete("/", controller.DeleteProject);

module.exports = router;
