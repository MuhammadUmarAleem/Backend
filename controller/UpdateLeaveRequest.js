const { connection } = require("../utils/database");

async function UpdateLeaveRequest(req, res) {
  try {
    const { Id, Status } = req.body;

    // Logging input data
    console.log("Received data:", { Id, Status });

    // Validate the status
    if (Status !== 'Approved' && Status !== 'Rejected') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    connection.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      connection.query('UPDATE Requests SET Status = ? WHERE Id = ?', [Status, Id], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error updating LeaveRequests:', err);
            return res.status(500).json({ message: 'Database error' });
          });
        }

        if (Status === 'Approved') {
          connection.query('SELECT EmployeeId, Date, RequestName  FROM Requests WHERE Id = ?', [Id], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error fetching LeaveRequest:', err);
                return res.status(500).json({ message: 'Database error' });
              });
            }

            const { EmployeeId, Date, RequestName  } = result[0];
            if(RequestName === 'Leave'){
              connection.query('UPDATE Attendance SET Status = ? WHERE EmployeeId = ? AND Date = ?', ['Leave', EmployeeId, Date], (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error('Error updating Attendance:', err);
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
                  res.status(200).json({ message: 'Leave request and attendance updated' });
                });
              });
            }
            else{
              res.status(200).json({ message: 'Request updated' });
            }
          });
        } else {
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ message: 'Database error' });
              });
            }
            res.status(200).json({ message: 'Leave request updated' });
          });
        }
      });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  UpdateLeaveRequest,
};
