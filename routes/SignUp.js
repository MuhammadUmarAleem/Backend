var express = require('express');
var router = express.Router();
const multer = require("multer");
const controller=require('../controller/SignUp');
const storageConfig = require("../utils/multer");

const upload = multer({ storage: storageConfig.storage });

router.post('/', upload.single("userimage"), controller.SignUp)
  
module.exports = router;