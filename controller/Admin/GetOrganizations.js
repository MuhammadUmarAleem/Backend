const Buyer = require("../../models/Buyer"); // Adjust the path if necessary

// Controller to get distinct organizations
const GetOrganizations = async (req, res) => {
  try {
    const organizations = await Buyer.distinct("primaryOrganization"); // Get unique organization names

    res.status(200).json({
      message: "Organizations retrieved successfully.",
      organizations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving organizations.",
      error: error.message,
    });
  }
};

module.exports = { GetOrganizations };
