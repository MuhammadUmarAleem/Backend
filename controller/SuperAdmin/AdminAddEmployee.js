const crypto = require("crypto");
const { transporter } = require("../../utils/nodemailer");
const { Users} = require("../../models/Users"); 
const { Employees} = require("../../models/Employees"); 
const { Teams} = require("../../models/Teams"); 

function generatePassword() {
  return Math.floor(100000 + Math.random() * 999999).toString(); // Generates a random 6-digit number
}

async function AdminAddEmployee(req, res) {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const { Email, FirstName, LastName, Position, Contact, DOJ, Salary, CNIC, HomeAddress, GitHubUsername, BankAccountName, BankAccountNo, TeamId } = req.body;
    const file = req.file;

    const Password = generatePassword();

    const hashedPassword = crypto.createHash("sha256").update(Password).digest("hex");

    // Check if the user already exists
    const existingUser = await Users.findOne({ where: { Email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const newUser = await Users.create({
      Email,
      FirstName,
      LastName,
      Password: hashedPassword,
      Role: 'Employee',
      Active: true
    }, { transaction });

    // Create employee
    const newEmployee = await Employees.create({
      UserId: newUser.ID,
      TeamId,
      Position,
      Contact,
      DOJ,
      Salary,
      CNIC,
      HomeAddress,
      GitHubUsername,
      BankAccountName,
      BankAccountNo,
      ProfileImage: file ? file.path : null
    }, { transaction });

    // Get team name
    const team = await Teams.findOne({ where: { ID: TeamId } });

    if (!team) {
      throw new Error('Team not found');
    }

    // Get SuperAdmin email
    const superAdmin = await Users.findOne({ where: { Role: 'SuperAdmin' } });

    if (!superAdmin) {
      throw new Error('SuperAdmin not found');
    }

    const AdminEmail = superAdmin.Email;

    // Send email to the new employee
    const mailOptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: 'Welcome to ResoSyncer - Your Login Credentials',
      text: `Dear ${FirstName} ${LastName},

Welcome to ResoSyncer! We are excited to have you on board and look forward to working with you. You have been added to the ${team.Title} team.

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

    await transaction.commit(); // Commit the transaction

    return res.status(200).json({ message: "User and employee added successfully", UserId: newUser.ID });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of error
    console.error("Error in AdminAddEmployee function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  AdminAddEmployee,
};
