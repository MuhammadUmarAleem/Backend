const { connection } = require("../utils/database");
const { transporter } = require("../utils/nodemailer");

async function TicketCompletionResponse(req, res) {
    const { Id, Status } = req.body;
    let State = null;

    // Logging input data
    console.log("Received data:", { Id, Status });

    // Validate the status
    if (Status !== 'Approved' && Status !== 'Rejected') {
        return res.status(400).json({ message: 'Invalid status' });
    }

    if (Status === 'Approved') {
        State = 'Completed';
    }
    if (Status === 'Rejected') {
        State = 'In progress';
    }

    connection.query(`UPDATE Tickets SET Status = ? WHERE Id = ?`, [State, Id], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.affectedRows > 0) {
            try {
                // Retrieve ticket and employee details
                const query = `
                    SELECT t.Name AS TicketName, u.FirstName, u.LastName, u.Email 
                    FROM Tickets t 
                    JOIN Users u ON t.EmployeeId = u.ID 
                    WHERE t.Id = ?`;
                const result = await queryDatabase(query, [Id]);

                if (result.length === 0) {
                    return res.status(404).json({ message: 'Ticket or Employee not found' });
                }

                const { TicketName, FirstName, LastName, Email } = result[0];

                // Send email notification to employee
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: Email,
                    subject: 'Ticket Completion Response',
                    text: `Dear ${FirstName} ${LastName},

Your completion request for the ticket “[${TicketName}]” has been ${Status === 'Approved' ? 'Accepted' : 'Rejected'}.

Regards,
ResoSyncer Team`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending email:", error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(200).json({ message: 'Ticket Updated and email sent' });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }
        } else {
            return res.status(404).json({ message: 'Ticket Not Found' });
        }
    });
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
    TicketCompletionResponse,
};
