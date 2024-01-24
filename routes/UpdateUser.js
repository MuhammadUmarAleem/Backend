var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateUser");

router.post("/", controller.updateUser);

module.exports = router;
