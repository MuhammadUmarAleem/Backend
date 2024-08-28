// Import required modules
const { connection } = require("../../utils/database");

// Function to temporarily deactivate a user
async function DeleteEvent(req, response) {
    try {
        // Extract email and the specific date from the request body
        const { id } = req.query;

        // Query to update the user's active status and set deleteDate to the specified date
        const query = `
      UPDATE event
      SET event.active = 0
      WHERE id = '${id}';
    `;

        // Execute the query
        connection.query(query, (err, res) => {
            if (err) {
                console.log("Error:", err);
                return response.status(500).json({ message: "An error occurred" });
            } else {
                return response.status(200).json({ message: "Event deactivated successfully" });
            }
        });
    } catch (err) {
        console.log("Error:", err);
        return response.status(500).json({ message: "An internal error occurred" });
    }
}

// Export the function for external use
module.exports = {
    DeleteEvent,
};
