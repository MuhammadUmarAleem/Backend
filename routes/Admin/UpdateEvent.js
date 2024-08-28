var express = require('express');
var router = express.Router();
const multer = require("multer");
const controller = require('../../controller/Admin/UpdateEvent');
const storageConfig = require("../../utils/multer");

// Configure multer storage
const upload = multer({ storage: storageConfig.storage });

// Define the route for updating an event
router.put('/:id', upload.single("image"), controller.UpdateEvent);

module.exports = router;
