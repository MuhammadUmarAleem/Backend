const { connection } = require("../utils/database");

async function CreateComment(req, response) {
  const TaskId = req.body.TaskId;
  const EmployeeId = req.body.EmployeeId;
  const Comment = req.body.Comment;

  const data = {
    TaskId: TaskId,
    EmployeeId: EmployeeId,
    Comment: Comment,
  };

  connection.query("INSERT INTO Comments SET ?", data, (err, res) => {
    if (err) throw err;
    else {
      response.status(200).json({ message: "Comment created" });
    }
  });
}

module.exports = {
  CreateComment,
};
