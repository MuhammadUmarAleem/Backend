const { sequelize } = require("../../utils/database");
const Attendance = require("../../models/Attendance");
const AttendanceTimer = require("../../models/AttendanceTimer");

async function StartTimer(req, res) {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const startTime = new Date();
  const date = startTime.toISOString().split('T')[0]; // Get only the date part

  const t = await sequelize.transaction();

  try {
    // Insert into Attendance table
    const attendance = await Attendance.create({
      EmployeeId: employeeId,
      Date: date,
      Status: 'Absent'
    }, { transaction: t });

    // Insert into AttendanceTimer table using the attendanceId
    const attendanceTimer = await AttendanceTimer.create({
      AttendanceId: attendance.Id,
      startTime: startTime
    }, { transaction: t });

    // Update Attendance status to 'Present'
    await attendance.update({
      Status: 'Present'
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'Timer started successfully',
      attendanceTimerId: attendanceTimer.Id,
      date: date
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  StartTimer,
};
