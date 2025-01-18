const PlanAssignment = require("../../models/PlanAssignment");
const User = require("../../models/User");
const Buyer = require("../../models/Buyer");

const assignPlanWithPermissions = async (req, res) => {
  try {
    const { userId, planId, permissionTypeId, programPermissionId } = req.body;

    // Check if the user already has the plan assigned
    const existingAssignment = await PlanAssignment.findOne({ userId, planId });
    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "Plan already assigned to this user." });
    }

    // Create a new PlanAssignment
    const newAssignment = new PlanAssignment({
      userId,
      planId,
      permissionTypeId,
      programPermissionId,
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      message: "Plan assigned to user successfully with permissions.",
      assignment: savedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning plan with permissions.",
      error: error.message,
    });
  }
};

const getAllUsersAssignedPlansWithPermissions = async (req, res) => {
  try {
    // Fetch all users with lean() to return plain objects
    const users = await User.find().lean();
    console.log("Fetched users:", users); // Log all users

    // Fetch plan assignments for users with assigned plans only
    const usersWithAssignedPlans = await Promise.all(
      users.map(async (user) => {
        // Fetch assigned plans for the current user, using lean() for consistency
        const assignedPlans = await PlanAssignment.find({ userId: user._id })
          .populate("planId", "name") // Populate plan details
          .populate("permissionTypeId", "name") // Populate permission type details
          .populate("programPermissionId", "name") // Populate program permission details
          .lean() // Ensuring the query returns plain objects
          .exec();

        console.log(`Assigned plans for user ${user._id}:`, assignedPlans); // Log the assigned plans for the user

        // Skip users without assigned plans
        if (assignedPlans.length === 0) {
          console.log(`No assigned plans for user ${user._id}`);
          return null; // Skip this user if no plans are assigned
        }

        // Fetch buyer details for the user using lean()
        const buyerDetails = await Buyer.findOne({ userId: user._id }).lean();
        console.log(`Buyer details for user ${user._id}:`, buyerDetails); // Log buyer details if present

        // Return the user with their buyer details and assigned plans
        return {
          user: {
            ...user,
            buyerDetails, // Include buyer-specific details if available
          },
          assignedPlans,
        };
      })
    );

    // Filter out null values (users without assigned plans)
    const filteredUsersWithAssignedPlans = usersWithAssignedPlans.filter(
      (entry) => entry !== null
    );
    console.log(
      "Filtered users with assigned plans:",
      filteredUsersWithAssignedPlans
    ); // Log the final filtered users

    // Send the filtered result in the response
    res.status(200).json({
      message:
        "Assigned plans with permissions for all users retrieved successfully.",
      usersWithAssignedPlans: filteredUsersWithAssignedPlans,
    });
  } catch (error) {
    console.error("Error retrieving assigned plans with permissions:", error); // Log any errors
    res.status(500).json({
      message:
        "Error retrieving assigned plans with permissions for all users.",
      error: error.message,
    });
  }
};

const updatePlanAssignment = async (req, res) => {
  try {
    const { id } = req.params; // PlanAssignment ID from URL params
    const { planId, permissionTypeId, programPermissionId } = req.body;

    // Find and update the PlanAssignment
    const updatedAssignment = await PlanAssignment.findByIdAndUpdate(
      id,
      { planId, permissionTypeId, programPermissionId },
      { new: true } // Return the updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Plan assignment not found." });
    }

    res.status(200).json({
      message: "Plan assignment updated successfully.",
      assignment: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating plan assignment.",
      error: error.message,
    });
  }
};

const deletePlanAssignment = async (req, res) => {
  try {
    const { id } = req.params; // PlanAssignment ID from URL params

    // Find and delete the PlanAssignment
    const deletedAssignment = await PlanAssignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Plan assignment not found." });
    }

    res.status(200).json({
      message: "Plan assignment deleted successfully.",
      assignment: deletedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting plan assignment.",
      error: error.message,
    });
  }
};

module.exports = {
  assignPlanWithPermissions,
  getAllUsersAssignedPlansWithPermissions,
  updatePlanAssignment,
  deletePlanAssignment,
};
