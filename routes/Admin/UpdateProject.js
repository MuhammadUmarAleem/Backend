var express = require("express");
var router = express.Router();
const controller = require("../../controller/Admin/UpdateProject");

router.put("/", controller.UpdateProject);

module.exports = router;