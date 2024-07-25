const { Teams } = require("../../models/Teams");

async function DeleteTeam(req, response) {
  const teamId = req.query.id; // Assuming the team ID is passed as a URL parameter

  try {
    const [updatedRows] = await Teams.update(
      { Active: false },
      { where: { Id: teamId } }
    );

    if (updatedRows === 0) {
      return response.status(404).json({ message: "Team not found" });
    }

    response.status(200).json({ message: "Team deactivated" });
  } catch (err) {
    console.error('Error in DeleteTeam function:', err);
    response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  DeleteTeam,
};
