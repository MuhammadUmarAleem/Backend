var express = require('express');
var router = express.Router();
const controller=require('../controller/Verify');

router.post('/', controller.Verify)
  
module.exports = router;