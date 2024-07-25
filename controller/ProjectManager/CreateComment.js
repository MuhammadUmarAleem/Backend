const { Comments } = require('../../models/Comments');

async function CreateComment(req, res) {
  const { TaskId, EmployeeId, Comment } = req.body;

  try {
    const newComment = await Comments.create({
      TaskId,
      EmployeeId,
      Comment
    });

    return res.status(200).json({ message: "Comment created" });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  CreateComment,
};
