var express = require('express');
var router = express.Router();
const controller=require('../controller/GetSocialMedia')

router.get('/', controller.GetSocialMedia)
  
module.exports = router;