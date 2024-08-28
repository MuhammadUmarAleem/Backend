// Import required modules
const { connection } = require("../../utils/database");

// Function to temporarily deactivate a user
async function PermanentDeactivateUser(req, response) {
    try {
        // Extract email and the specific date from the request body
        const { email } = req.body;

        // Query to update the user's active status and set deleteDate to the specified date
        const query = `
      UPDATE users
      SET active = 0
      WHERE email = '${email}';
    `;

        // Execute the query
        connection.query(query, (err, res) => {
            if (err) {
                console.log("Error:", err);
                return response.status(500).json({ message: "An error occurred" });
            } else {
                return response.status(200).json({ message: "User deactivated successfully" });
            }
        });
    } catch (err) {
        console.log("Error:", err);
        return response.status(500).json({ message: "An internal error occurred" });
    }
}

// Export the function for external use
module.exports = {
    PermanentDeactivateUser,
};
