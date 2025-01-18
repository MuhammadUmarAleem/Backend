const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Admin/Plans');

router.post('/add', Controller.addPlan);
router.get('/get', Controller.getPlans);
router.put('/update/:id', Controller.updatePlan);
router.delete('/delete/:id', Controller.deletePlan);

module.exports = router;
