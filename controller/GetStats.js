const { connection } = require("../utils/database");

async function GetStats(req, response) {
  try {
    const { id } = req.query;

    if (!id) {
      return response.status(400).json({ error: 'Employee ID is required' });
    }

    // Define the start and end dates for the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Function to calculate the number of working days between two dates
    function calculateWorkingDays(start, end) {
      let count = 0;
      let curDate = new Date(start);
      while (curDate <= end) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 is Sunday, 6 is Saturday
          count++;
        }
        curDate.setDate(curDate.getDate() + 1);
      }
      return count;
    }

    // Calculate working days
    const workingDays = calculateWorkingDays(startOfMonth, today);
    const expectedMinutes = workingDays * 6 * 60;

    console.log(`ID: ${id}, Start: ${startOfMonth}, End: ${today}`);

    // Fetch working minutes from the database
    connection.query(
      `SELECT SUM(TotalWorkingHours) as totalWorkingHours
       FROM AttendanceTimer
       JOIN Attendance ON AttendanceTimer.AttendanceId = Attendance.Id
       WHERE Attendance.EmployeeId = ? AND Attendance.Date BETWEEN ? AND ?`,
      [id, startOfMonth, today],
      (err, res) => {
        if (err) {
          console.log(err);
          return response.status(500).json({ error: 'Database query error' });
        } else {
          console.log('Query Result:', res);
          const totalWorkingHours = res[0].totalWorkingHours || 0;
          const workingMinutes = totalWorkingHours * 60;
          const shortMinutes = expectedMinutes - workingMinutes;

          return response.status(200).json({
            workingDays,
            expectedMinutes,
            workingMinutes,
            shortMinutes
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  GetStats,
};
