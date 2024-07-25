const { sequelize } = require("../../utils/database");
const { Requests } = require("../../models/Requests");

async function DeleteLeaveRequest(req, res) {
  const LeaveRequestId = req.query.id; // Assuming the leave request ID is passed as a URL parameter

  try {
    // Start a transaction
    const result = await sequelize.transaction(async (t) => {
      // Update the 'Active' field to false
      const [updatedRows] = await Requests.update(
        { Active: false },
        { where: { Id: LeaveRequestId }, transaction: t }
      );

      if (updatedRows === 0) {
        throw new Error('Request not found');
      }

      return updatedRows;
    });

    res.status(200).json({ message: 'Request deactivated' });
  } catch (err) {
    console.error('Error in DeleteLeaveRequest function:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  DeleteLeaveRequest,
};
