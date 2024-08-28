// Import required modules
const { connection } = require("../utils/database");

// Function to create a new event request
async function RequestToJoin(req, response) {
  try {
    // Extract data from the request
    const eventId = req.body.eventId; // Event ID from request body
    const email = req.body.email;     // Email from request body

    console.log('New Event Details:', { eventId, email });

    // Validate required fields
    if (!eventId || !email) {
      return response.status(400).json({ error: 'Event ID and Email are required' });
    }

    // Query to get userId from users table based on email
    connection.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error fetching user ID:', err);
        return response.status(500).json({ error: 'Failed to fetch user ID' });
      }

      if (results.length === 0) {
        return response.status(404).json({ error: 'User not found' });
      }

      const userId = results[0].id;

      // Prepare data for inserting into the 'requeststojoin' table
      const insertData = {
        eventId,
        userId,
      };

      // Insert data into the 'requeststojoin' table
      connection.query('INSERT INTO requeststojoin SET ?', insertData, (err, results) => {
        if (err) {
          console.error('Error inserting request:', err);
          return response.status(500).json({ error: 'Failed to create request' });
        }

        console.log('Request created successfully with ID:', results.insertId);
        response.status(201).json({ message: 'Request created successfully', id: results.insertId });
      });
    });
  } catch (err) {
    console.error('Error in RequestToJoin:', err);
    response.status(500).json({ error: 'Internal server error' });
  }
}

// Export the function for external use
module.exports = {
  RequestToJoin,
};
