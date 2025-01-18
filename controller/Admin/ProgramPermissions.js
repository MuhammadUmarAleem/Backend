const ProgramPermission = require("../../models/ProgramPermisison");

const addProgramPermission = async (req, res) => {
  try {
    const { permissionTypeId, name } = req.body;

    const newProgramPermission = new ProgramPermission({
      permissionTypeId,
      name,
    });
    const savedProgramPermission = await newProgramPermission.save();

    res.status(201).json({
      message: "Program permission added successfully.",
      programPermission: savedProgramPermission,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding program permission.",
      error: error.message,
    });
  }
};

const getProgramPermissions = async (req, res) => {
  try {
    const { permissionTypeId } = req.params; // Get the specific permission type ID from the request parameters

    const programPermissions = await ProgramPermission.find({
      permissionTypeId,
    }).populate("permissionTypeId", "name");

    if (programPermissions.length === 0) {
      return res.status(404).json({
        message:
          "No program permissions found for the specified permission type.",
      });
    }

    res.status(200).json({
      message: "Program permissions retrieved successfully.",
      programPermissions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving program permissions.",
      error: error.message,
    });
  }
};

const updateProgramPermission = async (req, res) => {
  try {
    const { id } = req.params; // Get the ProgramPermission ID from the request parameters
    const { name, permissionTypeId } = req.body; // Get updated fields from request body

    // Find and update the ProgramPermission by ID
    const updatedProgramPermission = await ProgramPermission.findByIdAndUpdate(
      id,
      { name, permissionTypeId },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    // Check if the ProgramPermission exists
    if (!updatedProgramPermission) {
      return res.status(404).json({ message: "Program permission not found." });
    }

    res.status(200).json({
      message: "Program permission updated successfully.",
      programPermission: updatedProgramPermission,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating program permission.",
      error: error.message,
    });
  }
};

const deleteProgramPermission = async (req, res) => {
  try {
    const { id } = req.params; // Get the ProgramPermission ID from the request parameters

    // Find and delete the ProgramPermission by ID
    const deletedProgramPermission = await ProgramPermission.findByIdAndDelete(
      id
    );

    // Check if the ProgramPermission exists
    if (!deletedProgramPermission) {
      return res.status(404).json({ message: "Program permission not found." });
    }

    res.status(200).json({
      message: "Program permission deleted successfully.",
      programPermission: deletedProgramPermission,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting program permission.",
      error: error.message,
    });
  }
};

module.exports = {
  addProgramPermission,
  getProgramPermissions,
  updateProgramPermission,
  deleteProgramPermission,
};
