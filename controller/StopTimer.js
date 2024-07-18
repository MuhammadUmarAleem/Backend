const { connection } = require("../utils/database");

async function StopTimer(req, res) {
  try {
    const { attendanceId,standupMessage } = req.body;

    if (!attendanceId) {
      return res.status(400).json({ error: 'Attendance ID is required' });
    }

    const endTime = new Date();

    // Fetch the startTime from AttendanceTimer using AttendanceId
    connection.query(
      'SELECT startTime FROM AttendanceTimer WHERE AttendanceId = ?',
      [attendanceId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Database query error' });
        } else {
          if (result.length === 0) {
            return res.status(404).json({ error: 'AttendanceTimer not found' });
          }

          const startTime = result[0].startTime;
          const totalWorkingHours = ((endTime - new Date(startTime)) / (1000 * 60 * 60)).toFixed(2); // Calculate total working hours

          // Update AttendanceTimer table
          connection.query(
            'UPDATE AttendanceTimer SET endTime = ?, TotalWorkingHours = ?, StandupMessage = ? WHERE AttendanceId = ?',
            [endTime, totalWorkingHours, standupMessage, attendanceId],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Database query error' });
              } else {
                const status = totalWorkingHours >= 6 ? 'Present' : 'Absent';

                // Update Attendance table with Status
                connection.query(
                  'UPDATE Attendance SET Status = ? WHERE Id = ?',
                  [status, attendanceId],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({ error: 'Database query error' });
                    } else {
                      return res.status(200).json({
                        message: 'Timer stopped successfully',
                        attendanceId,
                        totalWorkingHours,
                        status
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
  StopTimer,
};
