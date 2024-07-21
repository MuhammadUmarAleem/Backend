const { connection } = require("../utils/database");
const { transporter } = require("../utils/nodemailer");

async function CreateLeaveRequest(req, response) {
  const { EmployeeId, Date, Reason, RequestType } = req.body;

  try {
    // Insert leave request into the Requests table
    const data = {
      EmployeeId: EmployeeId,
      Date: Date,
      Reason: Reason,
      Status: null,
      Active: true,
      RequestName: RequestType,
    };

    let insertResult = await queryDatabase("INSERT INTO Requests SET ?", data);

    if (!insertResult.insertId) {
      return response.status(500).json({ message: "Failed to create leave request" });
    }

    // Retrieve employee details
    let query = "SELECT FirstName, LastName FROM Users WHERE ID = ?";
    let employeeResult = await queryDatabase(query, [EmployeeId]);

    if (employeeResult.length === 0) {
      return response.status(404).json({ message: "Employee not found" });
    }

    const { FirstName, LastName } = employeeResult[0];

    // Retrieve SuperAdmin email
    query = "SELECT Email FROM Users WHERE Role = 'SuperAdmin'";
    let adminResult = await queryDatabase(query);

    if (adminResult.length === 0) {
      return response.status(404).json({ message: "SuperAdmin not found" });
    }

    const AdminEmail = adminResult[0].Email;

    // Send email notification to SuperAdmin
    const mailOptions = {
      from: process.env.EMAIL,
      to: AdminEmail,
      subject: 'Employee Request Notification',
      text: `Dear Admin,

This is to inform you that ${FirstName} ${LastName} has submitted a leave request. Below are the details:
• Request Type: ${RequestType}
• Request Details: ${Reason}

Please review and process the request at your earliest convenience.

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

    return response.status(200).json({ message: "Leave request created" });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ message: "Internal server error" });
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
  CreateLeaveRequest,
};
