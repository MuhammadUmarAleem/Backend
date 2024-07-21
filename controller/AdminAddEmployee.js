const crypto = require("crypto");
const { transporter } = require("../utils/nodemailer");
const { connection } = require("../utils/database");

function generatePassword() {
  return Math.floor(100000 + Math.random() * 999999).toString(); // Generates a random 6-digit number
}

async function AdminAddEmployee(req, res) {
  try {
    const { Email, FirstName, LastName, Position, Contact, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo, TeamId } = req.body;
    const file = req.file;

    const Password = generatePassword();

    let ProfileImage = null;
    if (!file) {
      ProfileImage = null;
    } else {
      ProfileImage = file.path;
    }

    // Hash the password using sha256
    const hashedPassword = crypto.createHash("sha256").update(Password).digest("hex");

    // Check if the user already exists
    let query = "SELECT * FROM Users WHERE Email = ?";
    let existingUser = await queryDatabase(query, [Email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Insert into Users table
    query = "INSERT INTO Users (Email, FirstName, LastName, Password, Role, Active) VALUES (?, ?, ?, ?, ?, ?)";
    let insertedUser = await queryDatabase(query, [Email, FirstName, LastName, hashedPassword, "Employee", true]);

    if (!insertedUser.insertId) {
      return res.status(500).json({ message: "Failed to insert user" });
    }

    const UserId1 = insertedUser.insertId;

    // Insert into Employees table
    query = "INSERT INTO Employees (UserId, TeamId, Position, Contact, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo, ProfileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let insertedEmployee = await queryDatabase(query, [UserId1, TeamId, Position, Contact, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo, ProfileImage]);

    if (!insertedEmployee.insertId) {
      // Rollback user insertion if employee insertion fails
      query = "DELETE FROM Users WHERE Id = ?";
      await queryDatabase(query, [UserId1]);

      return res.status(500).json({ message: "Failed to insert employee" });
    }

    // Get team name from Teams table
    query = "SELECT Title FROM Teams WHERE Id = ?";
    let teamResult = await queryDatabase(query, [TeamId]);
    if (teamResult.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }
    const TeamName = teamResult[0].TeamName;

    // Get admin email from Users table where Role is SuperAdmin
    query = "SELECT Email FROM Users WHERE Role = 'SuperAdmin'";
    let adminResult = await queryDatabase(query);
    if (adminResult.length === 0) {
      return res.status(404).json({ message: "SuperAdmin not found" });
    }
    const AdminEmail = adminResult[0].Email;

    // Send email to the new employee
    const mailOptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: 'Welcome to ResoSyncer - Your Login Credentials',
      text: `Dear ${FirstName} ${LastName},

Welcome to ResoSyncer! We are excited to have you on board and look forward to working with you. You have been added to the ${TeamName} team.

Below are your login credentials:

• Username: ${Email}
• Password: ${Password}

If you have any questions or need any assistance, please feel free to contact ${AdminEmail}.

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

    return res.status(200).json({ message: "User and employee added successfully", UserId: UserId1 });
  } catch (error) {
    console.error("Error in AdminAddEmployee function:", error);
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
  AdminAddEmployee,
};
