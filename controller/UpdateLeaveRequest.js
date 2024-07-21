const { connection } = require("../utils/database");
const { transporter } = require("../utils/nodemailer");

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
            console.error('Error updating Requests:', err);
            return res.status(500).json({ message: 'Database error' });
          });
        }

        if (Status === 'Approved') {
          connection.query('SELECT EmployeeId, Date, RequestName FROM Requests WHERE Id = ?', [Id], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error fetching Request:', err);
                return res.status(500).json({ message: 'Database error' });
              });
            }

            const { EmployeeId, Date, RequestName } = result[0];
            if (RequestName === 'Leave') {
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

                  sendRequestResponseEmail(EmployeeId, Status, RequestName, Date);
                  res.status(200).json({ message: 'Leave request and attendance updated' });
                });
              });
            } else {
              sendRequestResponseEmail(EmployeeId, Status, RequestName, Date);
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
            sendRequestResponseEmail(EmployeeId, Status, RequestName, Date);
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

async function sendRequestResponseEmail(EmployeeId, Status, RequestName, Date) {
  try {
    // Fetch employee email and name
    const query = 'SELECT FirstName, LastName, Email FROM Users WHERE ID = ?';
    const result = await queryDatabase(query, [EmployeeId]);

    if (result.length === 0) {
      console.error('Employee not found');
      return;
    }

    const { FirstName, LastName, Email } = result[0];

    // Fetch SuperAdmin email
    const adminQuery = 'SELECT Email FROM Users WHERE Role = "SuperAdmin"';
    const adminResult = await queryDatabase(adminQuery);

    if (adminResult.length === 0) {
      console.error('SuperAdmin not found');
      return;
    }

    const adminEmail = adminResult[0].Email;

    const mailOptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: 'Request Response',
      text: `Dear ${FirstName} ${LastName},

We are writing to inform you that your request has been ${Status === 'Approved' ? 'Accepted' : 'Rejected'}.

Request Details:
• Request Type: ${RequestName}
• Request Date: ${Date}
• Details: Your leave request has been ${Status === 'Approved' ? 'Approved' : 'Rejected'}.

If you have any questions or need further information, please do not hesitate to contact us at ${adminEmail}.

Regards,
ResoSyncer Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function queryDatabase(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  UpdateLeaveRequest,
};
