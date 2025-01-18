// const User = require("../../models/User"); // Adjust the path if necessary
// const Buyer = require("../../models/Buyer"); // Adjust the path if necessary

// // Controller to get Buyers with optional filters for name and organization
// const GetUsers = async (req, res) => {
//   try {
//     const { name, organization } = req.query; // Extract query parameters

//     // Build the query object dynamically
//     const query = {};
//     if (name) {
//       query.$or = [
//         { firstName: { $regex: name, $options: "i" } }, // Case-insensitive search for firstName
//         { lastName: { $regex: name, $options: "i" } }, // Case-insensitive search for lastName
//       ];
//     }
//     if (organization) {
//       query.primaryOrganization = { $regex: organization, $options: "i" }; // Case-insensitive search
//     }

//     // Find buyers with the built query and populate user details
//     const buyers = await Buyer.find(query)
//       .populate("userId", "email username role active") // Populate specific fields from User model
//       .exec();

//     res.status(200).json({
//       message: "Buyers retrieved successfully.",
//       buyers,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error retrieving buyers.",
//       error: error.message,
//     });
//   }
// };

// module.exports = { GetUsers };


const User = require("../../models/User"); // User model
const Buyer = require("../../models/Buyer"); // Buyer model
const Seller = require("../../models/Seller"); // Seller model
const Admin = require("../../models/Admin"); // Seller model

// Controller to get all Users with additional details for Buyers and Sellers
const GetUsers = async (req, res) => {
  try {
    const { name, organization } = req.query; // Extract query parameters

    // Build the query object dynamically for the User model
    const query = {};
    if (name) {
      query.$or = [
        { username: { $regex: name, $options: "i" } }, // Case-insensitive search by username
        { email: { $regex: name, $options: "i" } },    // Case-insensitive search by email
      ];
    }

    if (organization) {
      query.primaryOrganization = { $regex: organization, $options: "i" }; // Case-insensitive search by organization
    }

    // Fetch all users based on the query
    const users = await User.find(query).lean(); // Use `.lean()` for plain JavaScript objects

    if (!users.length) {
      return res.status(404).json({
        message: "No users found.",
        users: [],
      });
    }

    // Fetch additional details for buyers and sellers
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        let additionalDetails = null;

        // Check user role and fetch details from the respective model
        if (user.role === "Buyer") {
          additionalDetails = await Buyer.findOne({ userId: user._id }).lean();
        } else if (user.role === "Seller") {
          additionalDetails = await Seller.findOne({ userId: user._id }).lean();
        }
        else if (user.role === "Admin") {
          additionalDetails = await Admin.findOne({ userId: user._id }).lean();
        }

        // Return the combined user details
        return {
          ...user,
          ...(additionalDetails || {}), // Directly merge fields from additionalDetails into user
        };
        
      })
    );

    // Send the response
    res.status(200).json({
      message: "Users retrieved successfully.",
      users: usersWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users.",
      error: error.message,
    });
  }
};

module.exports = { GetUsers };
