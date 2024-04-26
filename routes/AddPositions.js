var express = require("express");
var router = express.Router();
const controller = require("../controller/AddPositions");

router.post("/", controller.AddPositions);

module.exports = router;
