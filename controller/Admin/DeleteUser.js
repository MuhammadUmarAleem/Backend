const User = require("../../models/User");
const Buyer = require("../../models/Buyer");
const Admin = require("../../models/Admin");

const DeleteUser = async (req, res) => {
  const { userId } = req.params; // Get the userId from the request parameters
  console.log(userId, "userId");

  try {
    // Find the user to determine their role
    const user = await User.findById(userId);

    console.log("User", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let deletedBuyer = null;
    let deletedAdmin = null;

    // Check the user's role and remove buyer or admin accordingly
    if (user.role.toLowerCase() === "buyer") {
      // Try fetching the Buyer associated with the User
      deletedBuyer = await Buyer.findOneAndDelete({ userId });

      // Log and ensure that it's fine even if no buyer is found
      console.log("Deleted Buyer: ", deletedBuyer);

      // No Buyer found, no issue, we can proceed with user deletion
      if (!deletedBuyer) {
        console.log("No Buyer details found, but continuing with user deletion.");
      }
    } else if (user.role.toLowerCase() === "admin") {
      // Try fetching the Admin associated with the User
      deletedAdmin = await Admin.findOneAndDelete({ userId });

      // Log and ensure that it's fine even if no admin is found
      console.log("Deleted Admin: ", deletedAdmin);

      // No Admin found, no issue, we can proceed with user deletion
      if (!deletedAdmin) {
        console.log("No Admin details found, but continuing with user deletion.");
      }
    }

    // Now delete the User
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User and associated details deleted successfully.",
      user: deletedUser,
      buyer: deletedBuyer || null,  // Null if no buyer was deleted
      admin: deletedAdmin || null,  // Null if no admin was deleted
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting User and associated details.",
      error: error.message,
    });
  }
};

module.exports = { DeleteUser };
