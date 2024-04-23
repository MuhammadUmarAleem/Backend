var express = require('express');
var router = express.Router();
const controller=require('../controller/DeleteBot')

router.delete('/', controller.DeleteBot)
  
module.exports = router;