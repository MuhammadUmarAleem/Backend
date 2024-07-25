const { Teams } = require("../../models/Teams");

async function CreateTeam(req, response) {
  const { Title, LeadId } = req.body;

  try {
    // Check if the team already exists
    const existingTeam = await Teams.findOne({ where: { Title } });

    if (existingTeam) {
      response.status(200).json({ message: "already" });
      return;
    }

    // Create a new team
    const newTeam = await Teams.create({ Title, LeadId });

    response.status(200).json({ message: "created"});
  } catch (error) {
    console.error("Error in CreateTeam function:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  CreateTeam,
};
