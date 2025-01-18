const User = require("../../models/User"); // Adjust the path if necessary
const Buyer = require("../../models/Buyer"); // Adjust the path if necessary
const Admin = require("../../models/Admin"); // Adjust the path if necessary
const crypto = require('crypto');

// Utility function to generate a random username
const generateRandomUsername = () => {
  const prefix = "user"; // Optional prefix
  const randomString = Math.random().toString(36).substring(2, 8); // Generates a 6-character string
  return `${prefix}_${randomString}`;
};

// Controller to create a new User and Buyer
const CreateUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      active = true,
      firstName,
      lastName,
      phoneNumber,
      jobTitle,
      primaryOrganization,
      administrator,
    } = req.body;

    console.log(req.body);

    // Generate a random username
    let username = generateRandomUsername();

    // Ensure the username is unique
    while (await User.findOne({ username })) {
      username = generateRandomUsername();
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Create a new User
    const hashedPassword = crypto.SHA256(password).toString();

    const newUser = new User({
      email,
      password:hashedPassword,
      username,
      role,
      active,
    });

    const savedUser = await newUser.save();

    let savedBuyer = null;
    let savedAdmin = null;

    // Create the appropriate model based on the user's role
    if (role.toLowerCase().includes("buyer")) {
      const newBuyer = new Buyer({
        userId: savedUser._id,
        firstName,
        lastName,
        phoneNumber,
        jobTitle,
        primaryOrganization,
        administrator,
      });

      savedBuyer = await newBuyer.save();
    } else if (role.toLowerCase().includes("admin")) {
      const newAdmin = new Admin({
        userId: savedUser._id,
        firstName,
        lastName,
        phoneNumber,
        jobTitle,
        primaryOrganization,
        administrator,
      });

      savedAdmin = await newAdmin.save();
    }

    // Send response with saved user data and corresponding buyer or admin
    res.status(201).json({
      message: "User created successfully.",
      user: savedUser,
      buyer: savedBuyer,
      admin: savedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating User.",
      error: error.message,
    });
  }
};

module.exports = { CreateUser };
