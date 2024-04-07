const crypto = require("crypto");
const { connection } = require("../utils/database");

async function SignUp(req, response) {
  const Email = req.body.Email;
  const Username = req.body.Username;
  const Password = crypto
    .createHash("sha256")
    .update(req.body.Password)
    .digest("hex");

  const data = {
    Email: Email,
    Username: Username,
    Password: Password,
    Active: true,
  };
console.log(data)
  connection.query(`SELECT * FROM Users WHERE Email='${Email}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length == 0) {
        connection.query("INSERT INTO Users SET ?", data, (err, res) => {
          if (err) throw err;
          else {
            response
              .status(200)
              .json({ message: "sent", Email: Email});
          }
        });
      } else {
        response.status(200).json({ message: "already" });
      }
    }
  });
}

module.exports = {
  SignUp,
};
