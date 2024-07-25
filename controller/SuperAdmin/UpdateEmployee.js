const { Users } = require("../../models/Users");
const { Employees } = require("../../models/Employees");

async function UpdateEmployee(req, res) {
  const { 
    Email, FirstName, LastName, Position, DOJ, Salary, CNIC, HomeAddress, 
    GitHubUsername, BankAccountName, BankAccountNo 
  } = req.body;
  const Id = req.query.id;
  const file = req.file;
  const ProfileImage = file ? file.path : null;

  try {
    // Check if the email already exists in other users
    const existingUser = await Users.findOne({
      where: {
        Email,
        ID: { [Op.ne]: Id }
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Update user details
    const [updatedUserCount] = await Users.update(
      { Email, FirstName, LastName },
      { where: { ID: Id, Role: 'Employee' } }
    );

    if (updatedUserCount === 0) {
      return res.status(404).json({ message: "Employee not found or unauthorized" });
    }

    // Update employee details
    const updateData = {
      Position, DOJ, Salary, CNIC, HomeAddress, GitHubUsername,
      BankAccountName, BankAccountNo
    };

    if (ProfileImage) {
      updateData.ProfileImage = ProfileImage;
    }

    const [updatedEmployeeCount] = await Employees.update(
      updateData,
      { where: { UserId: Id } }
    );

    if (updatedEmployeeCount === 0) {
      // Rollback user update if employee update fails
      await Users.update(
        { Email: req.body.Email, FirstName: req.body.FirstName, LastName: req.body.LastName },
        { where: { ID: Id } }
      );
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "User and employee updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = {
  UpdateEmployee,
};
