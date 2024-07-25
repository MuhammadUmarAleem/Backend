const { Requests } = require("../../models/Requests");
const { Attendance} = require("../../models/Attendance");
const { Users } = require("../../models/Users");
const { transporter } = require("../../utils/nodemailer");

async function UpdateLeaveRequest(req, res) {
  try {
    const { Id, Status } = req.body;

    // Logging input data
    console.log("Received data:", { Id, Status });

    // Validate the status
    if (Status !== 'Approved' && Status !== 'Rejected') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Update request status
      const [updatedRequestCount] = await Requests.update(
        { Status },
        { where: { Id }, transaction }
      );

      if (updatedRequestCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Request not found' });
      }

      if (Status === 'Approved') {
        const request = await Requests.findOne({ where: { Id }, transaction });

        if (!request) {
          await transaction.rollback();
          return res.status(404).json({ message: 'Request not found' });
        }

        const { EmployeeId, Date, RequestName } = request;
        if (RequestName === 'Leave') {
          const [updatedAttendanceCount] = await Attendance.update(
            { Status: 'Leave' },
            { where: { EmployeeId, Date }, transaction }
          );

          if (updatedAttendanceCount === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Attendance not found' });
          }

          await transaction.commit();
          sendRequestResponseEmail(EmployeeId, Status, RequestName, Date);
          return res.status(200).json({ message: 'Leave request and attendance updated' });
        }
      }

      await transaction.commit();
      sendRequestResponseEmail(EmployeeId, Status, RequestName, Date);
      return res.status(200).json({ message: 'Request updated' });
    } catch (err) {
      await transaction.rollback();
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function sendRequestResponseEmail(EmployeeId, Status, RequestName, Date) {
  try {
    // Fetch employee email and name
    const employee = await Users.findOne({ where: { ID: EmployeeId } });

    if (!employee) {
      console.error('Employee not found');
      return;
    }

    const { FirstName, LastName, Email } = employee;

    // Fetch SuperAdmin email
    const superAdmin = await Users.findOne({ where: { Role: 'SuperAdmin' } });

    if (!superAdmin) {
      console.error('SuperAdmin not found');
      return;
    }

    const adminEmail = superAdmin.Email;

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

module.exports = {
  UpdateLeaveRequest,
};
