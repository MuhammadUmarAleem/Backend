const { Request } = require('../../models/Requests');
const { User } = require('../../models/Users');
const { transporter } = require('../../utils/nodemailer');

async function CreateLeaveRequest(req, res) {
  const { EmployeeId, Date, Reason, RequestType } = req.body;

  try {
    // Insert leave request into the Requests table
    const newRequest = await Request.create({
      EmployeeId,
      Date,
      Reason,
      Status: null,
      Active: true,
      RequestName: RequestType
    });

    if (!newRequest) {
      return res.status(500).json({ message: "Failed to create leave request" });
    }

    // Retrieve employee details
    const employee = await User.findOne({ where: { id: EmployeeId } });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { FirstName, LastName } = employee;

    // Retrieve SuperAdmin email
    const admin = await User.findOne({ where: { Role: 'SuperAdmin' } });

    if (!admin) {
      return res.status(404).json({ message: "SuperAdmin not found" });
    }

    const AdminEmail = admin.Email;

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

    return res.status(200).json({ message: "Leave request created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  CreateLeaveRequest,
};
