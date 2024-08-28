var express = require('express');
var router = express.Router();
const controller=require('../controller/EditSocial');


router.post('/', controller.EditSocial)
  
module.exports = router;