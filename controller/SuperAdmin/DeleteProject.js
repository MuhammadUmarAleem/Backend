const { Projects } = require("../../models/Projects");

async function DeleteProject(req, response) {
  const projectId = req.query.id; // Assuming the project ID is passed as a URL parameter

  try {
    const [updatedRows] = await Projects.update(
      { Active: false },
      { where: { Id: projectId } }
    );

    if (updatedRows === 0) {
      return response.status(404).json({ message: "Project not found" });
    }

    response.status(200).json({ message: "Project deactivated" });
  } catch (err) {
    console.error('Error in DeleteProject function:', err);
    response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  DeleteProject,
};
