var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetAnalyticsData')

router.get('/', controller.GetAnalyticsData)
  
module.exports = router;