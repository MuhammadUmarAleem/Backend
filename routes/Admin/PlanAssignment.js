const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/PlanAssignment');

router.post('/assign', Controller.assignPlanWithPermissions);
router.get('/get', Controller.getAllUsersAssignedPlansWithPermissions);
router.put('/update/:id', Controller.updatePlanAssignment);
router.delete('/delete/:id', Controller.deletePlanAssignment);

module.exports = router;
