const { connection } = require("../utils/database");

async function CreateLeaveRequest(req, response) {
  const { EmployeeId, Date, Reason } = req.body;

  const data = {
    EmployeeId: EmployeeId,
    Date: Date,
    Reason: Reason,
    Status: null,
    Active: true,
  };

  connection.query("INSERT INTO Requests SET ?", data, (err, res) => {
    if (err) {
      console.error(err);
      response.status(500).json({ message: "Database error" });
    } else {
      response.status(200).json({ message: "Leave request created" });
    }
  });
}

module.exports = {
  CreateLeaveRequest,
};
