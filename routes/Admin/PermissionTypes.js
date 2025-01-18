const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/PermisisonTypes');

router.post('/add', Controller.addPermissionType);
router.get('/get/:planId', Controller.getPermissionTypes);
router.put('/update/:id', Controller.updatePermissionType);
router.delete('/delete/:id', Controller.deletePermissionType);

module.exports = router;
