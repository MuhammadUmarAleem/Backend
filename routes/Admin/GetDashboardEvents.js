var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetDashboardEvents')

router.get('/', controller.GetDashboardEvents)
  
module.exports = router;