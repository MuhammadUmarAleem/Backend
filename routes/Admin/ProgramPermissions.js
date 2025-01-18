const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/ProgramPermissions');

router.post('/add', Controller.addProgramPermission);
router.get('/get/:permissionTypeId', Controller.getProgramPermissions);
router.put('/update/:id', Controller.updateProgramPermission);
router.delete('/delete/:id', Controller.deleteProgramPermission);

module.exports = router;
