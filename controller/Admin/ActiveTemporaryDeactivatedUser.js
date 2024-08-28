// Import required modules
const { connection } = require("../../utils/database");

// Function to update users with deleteDate set to yesterday
async function ActiveTemporaryDeactivatedUser(req, response) {
  try {
    // Query to update the active status of users whose deleteDate is yesterday
    const query = `
      UPDATE users
      SET active = 1, deleteDate = NULL
      WHERE deleteDate = CURDATE() - INTERVAL 1 DAY;
    `;

    // Execute the query
    connection.query(query, (err, res) => {
      if (err) {
        console.log("Error:", err);
        return response.status(500).json({ message: "An error occurred" });
      } else {
        return response.status(200).json({ message: "Users activated successfully" });
      }
    });
  } catch (err) {
    console.log("Error:", err);
    return response.status(500).json({ message: "An internal error occurred" });
  }
}

// Export the function for external use
module.exports = {
    ActiveTemporaryDeactivatedUser,
};
