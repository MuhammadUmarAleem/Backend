const { Projects } = require("../../models/Projects");

async function DeleteAProject(req, response) {
  try {
    const projectId = req.query.id;

    // Update the project's Active status to 0 (false)
    const [updatedRows] = await Projects.update(
      { Active: false },
      { where: { Id: projectId } }
    );

    if (updatedRows === 0) {
      return response.status(404).json({ message: "Project not found" });
    }

    return response.status(200).json({ message: "deleted" });
  } catch (err) {
    console.error("Error in DeleteAProject function:", err);
    return response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  DeleteAProject,
};
