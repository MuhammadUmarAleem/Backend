var express = require("express");
var router = express.Router();
const controller = require("../../controller/Employee/CompletionRequest");

router.put("/", controller.CompletionRequest);

module.exports = router;
