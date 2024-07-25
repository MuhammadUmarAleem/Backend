const { Teams } = require("../../models/Teams");

async function UpdateTeam(req, response) {
  const { Title, Id, LeadId } = req.body;

  try {
    // Check if another team with the same title exists (excluding the current team Id)
    const existingTeam = await Teams.findOne({
      where: {
        Title: Title,
        Id: {
          [Op.ne]: Id
        }
      }
    });

    if (!existingTeam) {
      // Update the team title
      const result = await Teams.update(
        { Title: Title, LeadId: LeadId },
        { where: { Id: Id } }
      );

      if (result[0] > 0) {
        return response.status(200).json({ message: "updated" });
      } else {
        return response.status(404).json({ error: "Team not found" });
      }
    } else {
      // Team with the same title already exists
      return response.status(200).json({ message: "already" });
    }
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  UpdateTeam,
};
