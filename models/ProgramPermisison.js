const mongoose = require('mongoose');

const programPermissionSchema = new mongoose.Schema({
  permissionTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PermissionType',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const ProgramPermission = mongoose.model('ProgramPermission', programPermissionSchema);

module.exports = ProgramPermission;
