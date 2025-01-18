const crypto = require("crypto");
const User = require("../../models/User"); // Adjust the path if necessary
const Buyer = require("../../models/Buyer"); // Adjust the path if necessary
const Admin = require("../../models/Admin"); // Adjust the path if necessary

// Controller to edit an existing User and Buyer
const UpdateUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    console.log(userId, "userId");

    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      jobTitle,
      primaryOrganization,
      administrator,
      active, // Assume active is optional
    } = req.body;

    // Hash the password if it's provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    }

    // Find the existing User and update basic user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        ...(hashedPassword && { password: hashedPassword }), // Only update password if provided
        ...(role && { role }),
        ...(typeof active === "boolean" && { active }),
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    let updatedBuyer = null;
    let updatedAdmin = null;

    // Handle Buyer update or creation
    if (role && role.toLowerCase() === "buyer") {
      updatedBuyer = await Buyer.findOneAndUpdate(
        { userId },
        {
          firstName,
          lastName,
          phoneNumber,
          jobTitle,
          primaryOrganization,
          administrator,
        },
        { new: true }
      );

      // If no Buyer is found, create one
      if (!updatedBuyer) {
        updatedBuyer = new Buyer({
          userId,
          firstName,
          lastName,
          phoneNumber,
          jobTitle,
          primaryOrganization,
          administrator,
        });
        updatedBuyer = await updatedBuyer.save();
      }
    }

    // Handle Admin update or creation
    if (role && role.toLowerCase() === "admin") {
      updatedAdmin = await Admin.findOneAndUpdate(
        { userId },
        {
          firstName,
          lastName,
          phoneNumber,
          jobTitle,
          primaryOrganization,
          administrator,
        },
        { new: true }
      );

      // If no Admin is found, create one
      if (!updatedAdmin) {
        updatedAdmin = new Admin({
          userId,
          firstName,
          lastName,
          phoneNumber,
          jobTitle,
          primaryOrganization,
          administrator,
        });
        updatedAdmin = await updatedAdmin.save();
      }
    }

    // Return a success response with the updated or newly created data
    res.status(200).json({
      message: "User and associated details updated successfully.",
      user: updatedUser,
      buyer: updatedBuyer || null,  // Return the newly created buyer or existing one
      admin: updatedAdmin || null,  // Return the newly created admin or existing one
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating User and associated details.",
      error: error.message,
    });
  }
};

module.exports = { UpdateUser };
