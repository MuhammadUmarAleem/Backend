const { connection } = require("../utils/database");
const { transporter } = require("../utils/nodemailer");

async function StopTimer(req, res) {
  try {
    const { attendanceId, standupMessage } = req.body;

    if (!attendanceId) {
      return res.status(400).json({ error: 'Attendance ID is required' });
    }

    const endTime = new Date();

    // Fetch the startTime and employee details from AttendanceTimer and Users using AttendanceId
    const query = `
      SELECT at.startTime, u.FirstName, u.LastName, u.Email 
      FROM AttendanceTimer at 
      JOIN Attendance a ON at.AttendanceId = a.Id 
      JOIN Users u ON a.EmployeeId = u.ID 
      WHERE at.AttendanceId = ?`;

    const result = await queryDatabase(query, [attendanceId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'AttendanceTimer not found' });
    }

    const { startTime, FirstName, LastName, Email } = result[0];
    const totalWorkingHours = ((endTime - new Date(startTime)) / (1000 * 60 * 60)).toFixed(2); // Calculate total working hours
    const status = totalWorkingHours >= 6 ? 'Present' : 'Absent';

    // Update AttendanceTimer table
    const updateTimerQuery = `
      UPDATE AttendanceTimer 
      SET endTime = ?, TotalWorkingHours = ?, StandupMessage = ? 
      WHERE AttendanceId = ?`;
    await queryDatabase(updateTimerQuery, [endTime, totalWorkingHours, standupMessage, attendanceId]);

    // Update Attendance table with Status
    const updateAttendanceQuery = `
      UPDATE Attendance 
      SET Status = ? 
      WHERE Id = ?`;
    await queryDatabase(updateAttendanceQuery, [status, attendanceId]);

    // Retrieve SuperAdmin email
    const adminQuery = "SELECT Email FROM Users WHERE Role = 'SuperAdmin'";
    const adminResult = await queryDatabase(adminQuery);

    if (adminResult.length === 0) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    const AdminEmail = adminResult[0].Email;

    // Send email notification to employee
    const mailOptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: `${FirstName} ${LastName}, Your Daily Work Summary`,
      text: `Dear ${FirstName} ${LastName},

Here is your work summary for today:
• Total Work Duration: ${totalWorkingHours} hours
• Status: ${status}

If you have any questions or need any assistance, please feel free to contact us at ${AdminEmail}.

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

    return res.status(200).json({
      message: 'Timer stopped successfully',
      attendanceId,
      totalWorkingHours,
      status
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
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
  StopTimer,
};
