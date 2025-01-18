const Plan = require("../../models/Plan");
const PermissionType = require("../../models/PermissionType");
const ProgramPermisison = require("../../models/ProgramPermisison");

const addPlan = async (req, res) => {
  try {
    const { name } = req.body;

    const newPlan = new Plan({ name });
    const savedPlan = await newPlan.save();

    res
      .status(201)
      .json({ message: "Plan added successfully.", plan: savedPlan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding plan.", error: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({ message: "Plans retrieved successfully.", plans });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving plans.", error: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params; // Plan ID from URL params
    const { name } = req.body; // New plan name from request body

    // Find the plan by ID and update its name
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json({
      message: "Plan updated successfully.",
      plan: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating plan.",
      error: error.message,
    });
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params; // Plan ID from URL params

    // Find and delete the plan
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    // Find all associated PermissionTypes
    const permissionTypes = await PermissionType.find({ planId: id });

    // Extract their IDs
    const permissionTypeIds = permissionTypes.map((pt) => pt._id);

    // Delete the associated PermissionTypes
    await PermissionType.deleteMany({ planId: id });

    // Delete all associated ProgramPermissions for the found PermissionType IDs
    await ProgramPermisison.deleteMany({
      permissionTypeId: { $in: permissionTypeIds },
    });

    res.status(200).json({
      message:
        "Plan, associated permission types, and program permissions deleted successfully.",
      plan: deletedPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting plan.",
      error: error.message,
    });
  }
};

module.exports = { addPlan, getPlans, deletePlan, updatePlan };
