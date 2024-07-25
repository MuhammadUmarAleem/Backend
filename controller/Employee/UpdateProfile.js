const { Users } = require("../../models/Users");
const { Employees } = require("../../models/Employees");
const { sequelize } = require("../../utils/database");

async function UpdateProfile(req, res) {
  const { Email, FirstName, LastName, Position, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo } = req.body;
  const Id = req.query.id;
  const file = req.file;
  const ProfileImage = file ? file.path : null;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Check if the email already exists
      const existingUser = await Users.findOne({
        where: {
          Email,
          Id: {
            [Op.ne]: Id,
          },
        },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({ message: "Email already exists" });
      }

      // Update the user
      const [userUpdateCount] = await Users.update(
        { Email, FirstName, LastName },
        {
          where: {
            Id,
            Role: 'Employee',
          },
          transaction,
        }
      );

      if (userUpdateCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: "Employee not found or unauthorized" });
      }

      // Update the employee profile
      const employeeUpdateData = { Position, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo };
      if (ProfileImage) {
        employeeUpdateData.ProfileImage = ProfileImage;
      }

      const [employeeUpdateCount] = await Employees.update(employeeUpdateData, {
        where: {
          UserId: Id,
        },
        transaction,
      });

      if (employeeUpdateCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: "Profile not found" });
      }

      await transaction.commit();
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      await transaction.rollback();
      console.error("Transaction error:", err);
      return res.status(500).json({ error: err.message });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  UpdateProfile,
};
