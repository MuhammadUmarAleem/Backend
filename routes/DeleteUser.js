var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteUser");

router.delete("/", controller.deleteUser);

module.exports = router;
