const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connection } = require("../utils/database");

function GenerateToken(user) {
  const payload = {
    Email: user.Email,
    Id: user.Id,
  };
  const token = jwt.sign(payload, "123456asdfghjkljasjdhgasdyt6rt2376tuasgd");
  return token;
}

async function Login(req, response) {
  console.log(req.body.Username,req.body.Password)
  const Username = req.body.Username;
  const Password = crypto
    .createHash("sha256")
    .update(req.body.Password)
    .digest("hex");

  connection.query(
    `
    SELECT Id,Email,Role FROM Users 
    WHERE Username='${Username}' AND Password='${Password}' and Active = true
    `,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          return response.status(200).json({ message: "invalid" });
        } else {
          var token = GenerateToken(res);
          return response.status(200).json({
            message: "success",
            email: res[0].Email,
            role: res[0].Role,
            token: token,
          });
        }
      }
    }
  );
}

module.exports = {
  Login,
};
