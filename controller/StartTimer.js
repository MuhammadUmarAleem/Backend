const { connection } = require("../utils/database");

async function StartTimer(req, res) {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const startTime = new Date();
    const date = startTime.toISOString().split('T')[0]; // Get only the date part

    // Insert into Attendance table
    connection.query(
      'INSERT INTO Attendance (EmployeeId, Date, Status) VALUES (?, ?, ?)',
      [employeeId, date, 'Absent'],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Database query error' });
        } else {
          const attendanceId = result.insertId;

          // Insert into AttendanceTimer table using the attendanceId
          connection.query(
            'INSERT INTO AttendanceTimer (AttendanceId, startTime) VALUES (?, ?)',
            [attendanceId, startTime],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Database query error' });
              } else {
                const attendanceTimerId = result.insertId;

                // Update Attendance status to 'Present'
                connection.query(
                  'UPDATE Attendance SET Status = ? WHERE Id = ?',
                  ['Present', attendanceId],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({ error: 'Database query error' });
                    } else {
                      return res.status(200).json({
                        message: 'Timer started successfully',
                        attendanceTimerId,
                        date
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  StartTimer,
};
