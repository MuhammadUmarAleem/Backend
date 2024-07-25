const { Tickets } = require("../../models/Tickets");
const { Projects } = require("../../models/Projects");
const { Users } = require("../../models/Users");
const { transporter } = require("../../utils/nodemailer");

async function CreateTicket(req, response) {
  const { ProjectId, EmployeeId, PMID, Taskname, Duedate, Priority, Status, Details } = req.body;

  try {
    // Check if the ticket already exists
    const existingTicket = await Tickets.findOne({
      where: { Taskname, ProjectId }
    });

    if (existingTicket) {
      return response.status(200).json({ message: 'already' });
    }

    // Insert the new ticket
    const insertedTicket = await Tickets.create({
      ProjectId,
      EmployeeId,
      Taskname,
      Duedate,
      Priority,
      Status,
      Details
    });

    // Fetch project name
    const project = await Projects.findOne({ where: { Id: ProjectId } });
    if (!project) {
      throw new Error('Project not found');
    }
    const projectName = project.Title;

    // Fetch employee name and email
    const employee = await Users.findOne({ where: { Id: EmployeeId } });
    if (!employee) {
      throw new Error('Employee not found');
    }
    const employeeName = `${employee.FirstName} ${employee.LastName}`;
    const employeeEmail = employee.Email;

    // Fetch project manager email
    const projectManager = await Users.findOne({ where: { Id: PMID } });
    if (!projectManager) {
      throw new Error('Project Manager not found');
    }
    const projectManagerEmail = projectManager.Email;

    // Send email notification to the employee
    await sendEmail(employeeEmail, employeeName, projectName, Taskname, Duedate, Priority, projectManagerEmail);

    return response.status(200).json({ message: 'created' });
  } catch (error) {
    console.error("Error in CreateTicket function:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

async function sendEmail(employeeEmail, employeeName, projectName, taskName, dueDate, priority, projectManagerEmail) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: employeeEmail,
    subject: `Ticket Assignment for ${projectName}`,
    text: `Dear ${employeeName},\n\nYou have been assigned a new ticket.\n\n• Ticket: ${taskName}\n• Deadline: ${dueDate}\n• Priority: ${priority}\n\nPlease complete the ticket by the deadline.\nIf you have any questions or need any assistance, please feel free to contact us at ${projectManagerEmail}.\n\nRegards,\nResoSyncer Team`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  CreateTicket,
};
