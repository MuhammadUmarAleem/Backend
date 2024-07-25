const { transporter } = require("../../utils/nodemailer");
const { Clients } = require("../../models/Clients");
const { Projects } = require("../../models/Projects");
const { Milestones } = require("../../models/Milestones");
const { Users } = require("../../models/Users");
const { sequelize } = require("../../utils/database");

async function CreateProject(req, res) {
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
    Milestones: milestonesData
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Check if client already exists or create a new client
    let client = await Clients.findOne({ where: { Email: ClientEmail } });
    if (!client) {
      client = await Clients.create({
        Name: ClientName,
        Contact: ClientContact,
        Email: ClientEmail,
        CountryName: ClientCountry,
        Active: true
      }, { transaction });
    }

    // Insert project details into Projects table
    const project = await Projects.create({
      Title,
      TeamId,
      PMId,
      StartingDate,
      EndDate,
      Status,
      ProjectType,
      GitHubRepo,
      ClientID: client.Id,
      Active: true
    }, { transaction });

    // Insert milestones into Milestones table (if provided)
    if (milestonesData && milestonesData.length > 0) {
      for (let milestone of milestonesData) {
        milestone.ProjectId = project.Id;
        await Milestones.create(milestone, { transaction });
      }
    }

    // Get PM details from Users table
    const pmDetails = await Users.findByPk(PMId);
    if (!pmDetails) {
      throw new Error("Failed to retrieve Project Manager details");
    }

    // Update PM role in Users table
    await Users.update({ Role: 'ProjectManager' }, { where: { ID: PMId }, transaction });

    // Get admin email from Users table where Role is SuperAdmin
    const admin = await Users.findOne({ where: { Role: 'SuperAdmin' } });
    if (!admin) {
      throw new Error("SuperAdmin not found");
    }

    // Send email to the PM
    const mailOptions = {
      from: process.env.EMAIL,
      to: pmDetails.Email,
      subject: 'Project Manager Role Assigned',
      text: `Dear ${pmDetails.FirstName} ${pmDetails.LastName},

We are excited to inform you that you have been assigned the role of Project Manager for the project "${Title}".

Please manage the project effectively and coordinate with your team to ensure timely completion.

If you have any questions or need any assistance, please feel free to contact ${admin.Email}.

Regards,
ResoSyncer Team`
    };

    await transporter.sendMail(mailOptions);

    await transaction.commit();
    res.status(200).json({ message: "Project created successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in CreateProject function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  CreateProject,
};
