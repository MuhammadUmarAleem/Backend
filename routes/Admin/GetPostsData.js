var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetPostsData')

router.get('/', controller.GetPostsData)
  
module.exports = router;