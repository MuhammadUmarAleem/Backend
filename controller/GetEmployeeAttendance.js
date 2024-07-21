const { connection } = require("../utils/database");

async function GetEmployeeAttendance(req, res) {
  const Id = req.query.id;

  if (!Id) {
    return res.status(400).json({ message: "Id is required" });
  }

  connection.query("SELECT * FROM Attendance Join AttendanceTimer On AttendanceTimer.AttendanceId = Attendance.Id WHERE Attendance.EmployeeId = ?", [Id], (err, results) => {
    if (err) {
      console.error("Error in GetComments function:", err);
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(200).json(results);
    }
  });
}

module.exports = {
    GetEmployeeAttendance,
};
