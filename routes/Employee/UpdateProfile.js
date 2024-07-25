var express = require('express');
var router = express.Router();
const multer = require("multer");
const controller=require('../../controller/Employee/UpdateProfile');
const storageConfig = require("../../utils/multer");

const upload = multer({ storage: storageConfig.storage });

router.put('/', upload.single("file"), controller.UpdateProfile)
  
module.exports = router;