const { connection } = require("../utils/database");

async function DeleteLeaveRequest(req, res) {
  try {
    const LeaveRequestId = req.query.id; // Assuming the leave request ID is passed as a URL parameter

    connection.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      connection.query('UPDATE Requests SET Active = FALSE WHERE Id = ?', LeaveRequestId, (err, result) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error updating Request:', err);
            return res.status(500).json({ message: 'Database error' });
          });
        }

        connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              console.error('Error committing transaction:', err);
              return res.status(500).json({ message: 'Database error' });
            });
          }
          res.status(200).json({ message: 'Request deactivated' });
        });
      });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  DeleteLeaveRequest,
};
