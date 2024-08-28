var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetEvent')

router.get('/', controller.GetEvent)
  
module.exports = router;