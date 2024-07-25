// controller/SuperAdmin/AddAdmin.js
const { transporter } = require("../../utils/nodemailer");
const { Users } = require("../../models/Users.js");

async function AddAdmin(req, res) {
  const Id = req.body.id;

  try {
    // Update user role to Admin
    const [updatedRows] = await Users.update(
      { Role: 'Admin' },
      { where: { ID: Id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Retrieve user details
    const user = await Users.findOne({
      where: { ID: Id },
      attributes: ['FirstName', 'LastName', 'Email']
    });

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    const { FirstName, LastName, Email } = user;

    // Retrieve SuperAdmin email
    const superAdmin = await Users.findOne({
      where: { Role: 'SuperAdmin' },
      attributes: ['Email']
    });

    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    const AdminEmail = superAdmin.Email;

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

module.exports = {
  AddAdmin,
};
