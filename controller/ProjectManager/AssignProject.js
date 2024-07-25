const { transporter } = require("../../utils/nodemailer");
const { Users } = require("../../models/Users");
const { Projects } = require("../../models/Projects");
const { EmployeesWorking } = require("../../models/EmployeesWorking");

async function AssignProject(req, res) {
  try {
    const { projectId, employeeId, PMID, role } = req.body;

    // Check if the assignment already exists
    let existingAssignment = await EmployeesWorking.findOne({
      where: { ProjectId: projectId, EmployeeId: employeeId }
    });

    if (existingAssignment) {
      return res.status(400).json({ message: "Assignment already exists" });
    }

    // Insert into EmployeesWorking table
    let insertedAssignment = await EmployeesWorking.create({
      ProjectId: projectId,
      EmployeeId: employeeId,
      Role: role
    });

    if (!insertedAssignment) {
      return res.status(500).json({ message: "Failed to assign project" });
    }

    // Get employee details from Users table
    let employee = await Users.findOne({
      where: { ID: employeeId },
      attributes: ['FirstName', 'LastName', 'Email']
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeName = `${employee.FirstName} ${employee.LastName}`;
    const employeeEmail = employee.Email;

    // Get project manager email from Users table
    let projectManager = await Users.findOne({
      where: { ID: PMID },
      attributes: ['Email']
    });

    if (!projectManager) {
      return res.status(404).json({ message: "Project Manager not found" });
    }

    const projectManagerEmail = projectManager.Email;

    // Get project name from Projects table
    let project = await Projects.findOne({
      where: { Id: projectId },
      attributes: ['Title']
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectName = project.Title;

    // Send email notification to the employee
    await sendEmail(employeeEmail, employeeName, projectName, role, projectManagerEmail);

    return res.status(200).json({ message: "Project assigned successfully", AssignmentId: insertedAssignment.ID });
  } catch (error) {
    console.error("Error in AssignProject function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function sendEmail(employeeEmail, employeeName, projectName, role, projectManagerEmail) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: employeeEmail,
    subject: "New Project Assignment",
    text: `Dear ${employeeName},\n\nYou have been assigned to the project "${projectName}" as a ${role}.\n\nPlease start working on the project and coordinate with your team.\nIf you have any questions or need any assistance, please feel free to contact us at ${projectManagerEmail}.\n\nRegards,\nResoSyncer Team`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  AssignProject,
};
