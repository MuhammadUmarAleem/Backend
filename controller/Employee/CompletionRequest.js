const { transporter } = require("../../utils/nodemailer");
const { Users } = require("../../models/Users");
const { Tickets } = require("../../models/Tickets");
const { Projects } = require("../../models/Projects");

async function CompletionRequest(req, res) {
  const { Id, UserId } = req.body;

  try {
    // Update the ticket status to "Completion Requested"
    const result = await Tickets.update({ Status: "Completion Requested" }, { where: { Id } });

    if (result[0] > 0) {
      // Fetch the employee's name
      const employee = await Users.findOne({ where: { ID: UserId }, attributes: ['FirstName', 'LastName'] });
      if (!employee) {
        throw new Error('Employee not found');
      }
      const employeeName = `${employee.FirstName} ${employee.LastName}`;

      // Fetch the ticket name and ProjectId
      const ticket = await Tickets.findOne({ where: { Id }, attributes: ['Taskname', 'ProjectId'] });
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      const ticketName = ticket.Taskname;
      const projectId = ticket.ProjectId;

      // Fetch the project manager's name and email using the projectId
      const projectManager = await Users.findOne({
          where: { Id: projectId }
          ,
        attributes: ['FirstName', 'LastName', 'Email']
      });
      if (!projectManager) {
        throw new Error('Project manager not found');
      }
      const projectManagerName = `${projectManager.FirstName} ${projectManager.LastName}`;
      const projectManagerEmail = projectManager.Email;

      // Send email notification to the project manager
      await sendEmail(projectManagerEmail, projectManagerName, employeeName, ticketName);

      return res.status(200).json({ message: 'Ticket Updated' });
    } else {
      return res.status(404).json({ message: 'Ticket Not Found' });
    }
  } catch (error) {
    console.error("Error in CompletionRequest function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function sendEmail(projectManagerEmail, projectManagerName, employeeName, ticketName) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: projectManagerEmail,
    subject: "Ticket Completion Request",
    text: `Dear ${projectManagerName},\n\n${employeeName} has submitted a completion request for the ticket "${ticketName}".\n\nPlease review the request and take the necessary action.\n\nRegards,\nResoSyncer Team`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  CompletionRequest,
};
