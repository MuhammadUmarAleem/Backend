const { connection } = require("../utils/database");

async function GetAttendance(req, response) {
  try {
    const { date } = req.query; // Assuming date is provided as a query parameter in format YYYY-MM-DD

    // Validate date format (optional step depending on your validation needs)
    if (!isValidDate(date)) {
      return response.status(400).json({ error: 'Invalid date format. Please provide date in YYYY-MM-DD format.' });
    }

    // Execute the SQL query using a parameterized query to avoid SQL injection
    connection.query(
      `SELECT Attendance.Id, Users.FirstName, Users.Lastname, AttendanceTimer.startTime, AttendanceTimer.endTime, AttendanceTimer.TotalWorkingHours, AttendanceTimer.StandupMessage, Attendance.Status
      FROM Attendance 
      JOIN AttendanceTimer ON AttendanceTimer.AttendanceId = Attendance.Id
      JOIN Employees ON Employees.Id = Attendance.EmployeeId
      JOIN Users ON Users.ID = Employees.UserId
      WHERE DATE(Attendance.Date) = ?`, [date], // Use DATE() function to compare dates only
      (err, res) => {
        if (err) {
          console.log(err);
          return response.status(500).json({ error: 'Internal server error' });
        } else {
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// Function to validate date format (optional)
function isValidDate(dateString) {
  // Regex to validate date in YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

module.exports = {
  GetAttendance,
};
