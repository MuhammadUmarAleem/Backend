var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/DeleteEvent')

router.delete('/', controller.DeleteEvent)
  
module.exports = router;