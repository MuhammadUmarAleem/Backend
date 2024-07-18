const { connection } = require("../utils/database");

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
