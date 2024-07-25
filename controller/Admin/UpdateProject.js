const { Projects } = require("../../models/Projects");
const { Clients } = require("../../models/Clients");
const { Milestones } = require("../../models/Milestones");
const { Users} = require("../../models/Users");
const { sequelize } = require("../../utils/database");

async function UpdateProject(req, res) {
  const projectId = req.query.id;
  const {
    Title,
    TeamId,
    PMId,
    StartingDate,
    EndDate,
    Status,
    ProjectType,
    GitHubRepo,
    ClientName,
    ClientContact,
    ClientEmail,
    ClientCountry,
    Milestones
  } = req.body;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Fetch current project details
      const currentProject = await Projects.findByPk(projectId, { transaction });
      if (!currentProject) {
        throw new Error("Project not found");
      }

      // Update project details
      await Projects.update(
        { Title, TeamId, PMId, StartingDate, EndDate, Status, ProjectType, GitHubRepo },
        { where: { Id: projectId }, transaction }
      );

      // Update or create client details if provided
      if (ClientEmail) {
        let client = await Clients.findOne({ where: { Email: ClientEmail }, transaction });
        if (client) {
          await Clients.update(
            { Name: ClientName, Contact: ClientContact, CountryName: ClientCountry },
            { where: { Id: client.Id }, transaction }
          );
        } else {
          client = await Clients.create(
            { Name: ClientName, Contact: ClientContact, Email: ClientEmail, CountryName: ClientCountry, Active: true },
            { transaction }
          );
          await Projects.update(
            { ClientID: client.Id },
            { where: { Id: projectId }, transaction }
          );
        }
      }

      // Update or create milestones if provided
      if (Milestones && Milestones.length > 0) {
        for (let milestone of Milestones) {
          milestone.ProjectId = projectId;
          if (milestone.Id) {
            await Milestones.update(milestone, { where: { Id: milestone.Id }, transaction });
          } else {
            await Milestones.create(milestone, { transaction });
          }
        }
      }

      // Update PM role if project is completed
      if (Status === "Completed") {
        await Users.update(
          { Role: "Employee" },
          { where: { Id: currentProject.PMId }, transaction }
        );
      }

      // Commit transaction
      await transaction.commit();
      res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      console.error("Transaction error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error in UpdateProject function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  UpdateProject,
};
