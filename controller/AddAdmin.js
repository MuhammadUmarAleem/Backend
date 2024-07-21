const { connection } = require("../utils/database");
const { transporter } = require("../utils/nodemailer");

async function AddAdmin(req, res) {
  const Id = req.body.id;

  try {
    // Update user role to Admin
    let query = "UPDATE Users SET Role = 'Admin' WHERE ID = ?";
    let result = await queryDatabase(query, [Id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Retrieve user details
    query = "SELECT FirstName, LastName, Email FROM Users WHERE ID = ?";
    let userResult = await queryDatabase(query, [Id]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    const { FirstName, LastName, Email } = userResult[0];

    // Retrieve SuperAdmin email
    query = "SELECT Email FROM Users WHERE Role = 'SuperAdmin'";
    let adminResult = await queryDatabase(query);

    if (adminResult.length === 0) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    const AdminEmail = adminResult[0].Email;

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL,
      to: Email,
      subject: 'Admin Role Assigned',
      text: `Dear ${FirstName} ${LastName},

We are pleased to inform you that you have been assigned the role of Admin in ResoSyncer.

You now have the following privileges:
• View Stats
• Manage Projects
• Manage Employees
• Manage Teams

If you have any questions, please feel free to contact us at ${AdminEmail}.

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

    res.status(200).json({ message: 'Admin Added' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
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
  AddAdmin,
};
