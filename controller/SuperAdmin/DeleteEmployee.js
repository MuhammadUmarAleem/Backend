const { Users } = require("../../models/Users");

async function DeleteEmployee(req, response) {
  try {
    const employeeId = req.query.id;

    // Update the user's Active status to 0 (false) if they have the role 'Employee'
    const [updatedRows] = await Users.update(
      { Active: false },
      { where: { ID: employeeId, Role: 'Employee' } }
    );

    if (updatedRows === 0) {
      return response.status(404).json({ message: "Employee not found or not an employee role" });
    }

    return response.status(200).json({ message: "deleted" });
  } catch (err) {
    console.error("Error in DeleteEmployee function:", err);
    return response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  DeleteEmployee,
};
