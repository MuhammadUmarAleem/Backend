const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/Users");
const Employee = require("../models/Employees");

function GenerateToken(user) {
  const payload = {
    Email: user.Email,
    Role: user.Role,
    Id: user.Id,
  };
  const token = jwt.sign(payload, "123456asdfghjkljasjdhgasdyt6rt2376tuasgd");
  return token;
}

async function Login(req, res) {
  const Email = req.body.Email;
  const Password = crypto
    .createHash("sha256")
    .update(req.body.Password)
    .digest("hex");

  try {
    const user = await User.findOne({
      where: {
        Email: Email,
        Password: Password,
        Active: true
      },
      attributes: ['Id', 'Email', 'FirstName', 'LastName', 'Role']
    });

    if (!user) {
      return res.status(200).json({ message: "invalid" });
    }

    const employee = await Employee.findOne({
      where: {
        UserId: user.Id
      },
      attributes: ['ProfileImage']
    });

    const token = GenerateToken(user);

    return res.status(200).json({
      id: user.Id,
      useremail: user.Email,
      userrole: user.Role,
      userprofile: employee ? employee.ProfileImage : null,
      username: `${user.FirstName} ${user.LastName}`,
      jsonwebtoken: token,
    });
  } catch (error) {
    console.error("Error in Login function:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  Login,
};
