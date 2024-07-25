const Attendance = require("../../models/Attendance");
const AttendanceTimer = require("../../models/AttendanceTimer");
const Users = require("../../models/Users");
const { transporter } = require("../../utils/nodemailer");

async function StopTimer(req, res) {
  const { attendanceId, standupMessage } = req.body;

  if (!attendanceId) {
    return res.status(400).json({ error: 'Attendance ID is required' });
  }

  const endTime = new Date();

  try {
    // Fetch the startTime and employee details from AttendanceTimer and Users using AttendanceId
    const result = await AttendanceTimer.findOne({
      where: { AttendanceId: attendanceId },
      raw: true,
      nest: true,
      include: [{
        model: Attendance,
        attributes: ['EmployeeId'],
        include: [{
          model: Users,
          attributes: ['FirstName', 'LastName', 'Email']
        }]
      }]
    });

    if (!result) {
      return res.status(404).json({ error: 'AttendanceTimer not found' });
    }

    const { startTime, 'Attendance.EmployeeId': employeeId, 'Attendance.User': user } = result;
    const totalWorkingHours = ((endTime - new Date(startTime)) / (1000 * 60 * 60)).toFixed(2); // Calculate total working hours
    const status = totalWorkingHours >= 6 ? 'Present' : 'Absent';

    // Update AttendanceTimer table
    await AttendanceTimer.update(
      {
        endTime: endTime,
        TotalWorkingHours: totalWorkingHours,
        StandupMessage: standupMessage
      },
      { where: { AttendanceId: attendanceId } }
    );

    // Update Attendance table with Status
    await Attendance.update({ Status: status }, { where: { Id: attendanceId } });

    // Retrieve SuperAdmin email
    const superAdmin = await Users.findOne({ where: { Role: 'SuperAdmin' }, raw: true });

    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    const AdminEmail = superAdmin.Email;

    // Send email notification to employee
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.Email,
      subject: `${user.FirstName} ${user.LastName}, Your Daily Work Summary`,
      text: `Dear ${user.FirstName} ${user.LastName},

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

module.exports = {
  StopTimer,
};
