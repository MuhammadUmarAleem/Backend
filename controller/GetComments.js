const { connection } = require("../utils/database");

async function GetComments(req, res) {
  const TaskId = req.query.id;

  if (!TaskId) {
    return res.status(400).json({ message: "TaskId is required" });
  }

  connection.query("SELECT * FROM Comments WHERE TaskId = ?", [TaskId], (err, results) => {
    if (err) {
      console.error("Error in GetComments function:", err);
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(200).json(results);
    }
  });
}

module.exports = {
  GetComments,
};
