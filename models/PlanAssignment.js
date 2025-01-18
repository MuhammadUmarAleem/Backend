const mongoose = require('mongoose');

const planAssignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan', // Reference to the Plan model
    required: true
  },
  permissionTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PermissionType', // Reference to the PermissionType model
    required: false // Optional, depending on your requirements
  },
  programPermissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProgramPermission', // Reference to the ProgramPermission model
    required: false // Optional, depending on your requirements
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const PlanAssignment = mongoose.model('PlanAssignment', planAssignmentSchema);

module.exports = PlanAssignment;
