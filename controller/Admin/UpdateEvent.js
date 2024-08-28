// Import required modules
const strftime = require("strftime");
const { connection } = require("../../utils/database");

// Function to update an event
async function UpdateEvent(req, response) {
  try {
    // Extract data from the request
    const eventId = req.params.id; // Event ID from URL parameters
    const title = req.body.title;
    const image = req.file ? req.file.filename : null; // Check if file was uploaded
    const location = req.body.location;
    const date = req.body.date;
    const description = req.body.description;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    
    // Get the current date and time
    const now = new Date();
    const dateUpdated = strftime("%Y-%m-%d %H:%M:%S", now);

    console.log('Event Details:', { eventId, title, image, location, date, dateUpdated });

    // Validate required fields
    if (!eventId) {
      return response.status(400).json({ error: 'Event ID is required' });
    }

    // Check if the event exists
    connection.query('SELECT * FROM event WHERE id = ?', [eventId], (err, results) => {
      if (err) {
        console.error('Error fetching event:', err);
        return response.status(500).json({ error: 'Database query error' });
      }

      if (results.length === 0) {
        return response.status(404).json({ error: 'Event not found' });
      }

      // Prepare data for updating the 'event' table
      const updateData = {
        title,
        description,
        image,
        location,
        date,
        latitude,
        longitude,
        updatedAt: dateUpdated,
      };

      // Remove undefined properties
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      // Update data in the 'event' table
      connection.query('UPDATE event SET ? WHERE id = ?', [updateData, eventId], (err) => {
        if (err) {
          console.error('Error updating event:', err);
          return response.status(500).json({ error: 'Failed to update event' });
        }

        console.log('Event updated successfully');
        response.status(200).json({ message: 'Event updated successfully' });
      });
    });
  } catch (err) {
    console.error('Error in UpdateEvent:', err);
    response.status(500).json({ error: 'Internal server error' });
  }
}

// Export the function for external use
module.exports = {
  UpdateEvent,
};
