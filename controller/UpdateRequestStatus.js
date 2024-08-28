// Import required modules
const { connection } = require("../utils/database");

// Function to update the status of a request
async function UpdateRequestStatus(req, response) {
  try {
    // Extract parameters from the request query
    const requestId = req.query.requestId; // Request ID from query parameters
    const status = req.query.status;       // New status from query parameters

    console.log('Update Request Details:', { requestId, status });

    // Validate required fields
    if (!requestId || !status) {
      return response.status(400).json({ error: 'Request ID and Status are required' });
    }

    // Query to update the status of the request
    connection.query('UPDATE requeststojoin SET status = ? WHERE id = ?', [status, requestId], (err, results) => {
      if (err) {
        console.error('Error updating request status:', err);
        return response.status(500).json({ error: 'Failed to update request status' });
      }

      // Check if any rows were affected (i.e., the request was found and updated)
      if (results.affectedRows === 0) {
        return response.status(404).json({ error: 'Request not found' });
      }

      console.log('Request status updated successfully for ID:', requestId);
      response.status(200).json({ message: 'Request status updated successfully' });
    });
  } catch (err) {
    console.error('Error in updateRequestStatus:', err);
    response.status(500).json({ error: 'Internal server error' });
  }
}

// Export the function for external use
module.exports = {
  UpdateRequestStatus,
};
