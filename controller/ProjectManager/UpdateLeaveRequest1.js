const { Requests} = require("../../models/Requests");
const { Attendance } = require("../../models/Attendance");
const { sequelize } = require("../../utils/database");

async function UpdateLeaveRequest1(req, res) {
  const { Id, Status } = req.body;

  // Logging input data
  console.log("Received data:", { Id, Status });

  // Validate the status
  if (Status !== 'Approved' && Status !== 'Rejected') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Update the request status
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

        const { EmployeeId, Date, RequestName } = request;

        if (RequestName === 'Leave') {
          const [updatedAttendanceCount] = await Attendance.update(
            { Status: 'Leave' },
            {
              where: {
                EmployeeId,
                Date,
              },
              transaction,
            }
          );

          if (updatedAttendanceCount === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Attendance record not found' });
          }
        }

        await transaction.commit();
        return res.status(200).json({ message: 'Leave request and attendance updated' });
      } else {
        await transaction.commit();
        return res.status(200).json({ message: 'Request updated' });
      }
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

module.exports = {
  UpdateLeaveRequest1,
};
