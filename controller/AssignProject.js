const { connection } = require("../utils/database");
const { transporter } = require("../utils/nodemailer");

async function AssignProject(req, res) {
  try {
    const { projectId, employeeId, role } = req.body;

    // Check if the assignment already exists
    let query = "SELECT * FROM EmployeesWorking WHERE ProjectId = ? AND EmployeeId = ?";
    let existingAssignment = await queryDatabase(query, [projectId, employeeId]);

    if (existingAssignment.length > 0) {
      return res.status(400).json({ message: "Assignment already exists" });
    }

    // Insert into EmployeesWorking table
    query = "INSERT INTO EmployeesWorking (ProjectId, EmployeeId, Role) VALUES (?, ?, ?)";
    let insertedAssignment = await queryDatabase(query, [projectId, employeeId, role]);

    if (!insertedAssignment.insertId) {
      return res.status(500).json({ message: "Failed to assign project" });
    }

    // Retrieve employee details
    query = "SELECT FirstName, LastName, Email FROM Users WHERE ID = ?";
    let employeeResult = await queryDatabase(query, [employeeId]);

    if (employeeResult.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { FirstName, LastName, Email } = employeeResult[0];

    // Retrieve project name
    query = "SELECT Title FROM Projects WHERE Id = ?";
    let projectResult = await queryDatabase(query, [projectId]);

    if (projectResult.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const ProjectName = projectResult[0].Title;

    // Retrieve SuperAdmin email
    query = "SELECT Email FROM Users WHERE Role = 'SuperAdmin'";
    let adminResult = await queryDatabase(query);

    if (adminResult.length === 0) {
      return res.status(404).json({ message: "SuperAdmin not found" });
    }

    const AdminEmail = adminResult[0].Email;

    // Send email notification if the role is PM
    if (role === 'ProjectManager') {
      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: 'Project Manager Role Assigned',
        text: `Dear ${FirstName} ${LastName},

We are excited to inform you that you have been assigned the role of Project Manager for the project "${ProjectName}".

Please manage the project effectively and coordinate with your team to ensure timely completion.

If you have any questions or need any assistance, please feel free to contact us at ${AdminEmail}.

Regards,
ResoSyncer Team`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    return res.status(200).json({ message: "Project assigned successfully", AssignmentId: insertedAssignment.insertId });
  } catch (error) {
    console.error("Error in AssignProject function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function queryDatabase(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  AssignProject,
};
