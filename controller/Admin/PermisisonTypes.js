const PermissionType = require("../../models/PermissionType");
const ProgramPermisison = require("../../models/ProgramPermisison");

const addPermissionType = async (req, res) => {
  try {
    const { planId, name } = req.body;

    const newPermissionType = new PermissionType({ planId, name });
    const savedPermissionType = await newPermissionType.save();

    res.status(201).json({
      message: "Permission type added successfully.",
      permissionType: savedPermissionType,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding permission type.", error: error.message });
  }
};

const getPermissionTypes = async (req, res) => {
  try {
    const { planId } = req.params; // Get the specific plan ID from the request parameters

    const permissionTypes = await PermissionType.find({ planId }).populate(
      "planId",
      "name"
    );

    if (permissionTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No permission types found for the specified plan." });
    }

    res.status(200).json({
      message: "Permission types retrieved successfully.",
      permissionTypes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving permission types.",
      error: error.message,
    });
  }
};

const updatePermissionType = async (req, res) => {
  try {
    const { id } = req.params; // PermissionType ID from URL params
    const { planId, name } = req.body; // Updated fields from request body

    // Update the PermissionType
    const updatedPermissionType = await PermissionType.findByIdAndUpdate(
      id,
      { planId, name },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedPermissionType) {
      return res.status(404).json({ message: "Permission type not found." });
    }

    res.status(200).json({
      message: "Permission type updated successfully.",
      permissionType: updatedPermissionType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating permission type.",
      error: error.message,
    });
  }
};

const deletePermissionType = async (req, res) => {
  try {
    const { id } = req.params; // PermissionType ID from URL params

    // Find and delete the PermissionType
    const deletedPermissionType = await PermissionType.findByIdAndDelete(id);

    if (!deletedPermissionType) {
      return res.status(404).json({ message: "Permission type not found." });
    }

    // Delete all associated ProgramPermissions
    await ProgramPermisison.deleteMany({ permissionTypeId: id });

    res.status(200).json({
      message:
        "Permission type and associated program permissions deleted successfully.",
      permissionType: deletedPermissionType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting permission type.",
      error: error.message,
    });
  }
};

module.exports = {
  addPermissionType,
  getPermissionTypes,
  updatePermissionType,
  deletePermissionType,
};
