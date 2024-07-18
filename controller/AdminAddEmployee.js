const crypto = require("crypto");
const { transporter } = require("../utils/nodemailer");
const { connection } = require("../utils/database");

function generatePassword() {
  return Math.floor(100000 + Math.random() * 999999).toString(); // Generates a random 6-digit number
}

async function AdminAddEmployee(req, res) {
  try {
    const { Email, FirstName, LastName, Position, Contact, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo } = req.body;
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
    let insertedEmployee = await queryDatabase(query, [UserId1, req.body.TeamId, Position, Contact, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo, ProfileImage]);

    if (!insertedEmployee.insertId) {
      // Rollback user insertion if employee insertion fails
      query = "DELETE FROM Users WHERE Id = ?";
      await queryDatabase(query, [UserId1]);

      return res.status(500).json({ message: "Failed to insert employee" });
    }

    // Send email to the new employee
    const mailOptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: 'Welcome to Tiers Limited',
      text: `Dear ${FirstName} ${LastName},

Welcome to Tiers Limited! We are excited to have you join our team as a ${Position}.

Your account has been successfully created with the following credentials:

Email: ${Email}
Password: ${Password}

Please log in to your account using the above credentials and change your password at your earliest convenience.

If you have any questions or need further assistance, feel free to reach out to your supervisor or the HR department.

We look forward to your valuable contributions to our team.

Best regards,

Tiers Limited`
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
