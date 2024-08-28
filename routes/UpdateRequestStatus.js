var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateRequestStatus");

router.put("/", controller.UpdateRequestStatus);

module.exports = router;
