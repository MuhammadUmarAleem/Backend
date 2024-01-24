const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connection } = require("../utils/database");

function GenerateToken(user) {
  const payload = {
    role: user.role,
    id: user.id,
  };
  const token = jwt.sign(payload, "123456asdfghjkljasjdhgasdyt6rt2376tuasgd");
  return token;
}

async function AdminLogin(req, response) {
  const username = req.body.username;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  connection.query(
    `SELECT * FROM users WHERE username='${username}' and password='${password}' and role = 1`,
    (err, res) => {
        console.log(res);
      if (err) throw err;
      else {
        if (res.length == 0) {
          return response.status(200).json({ message: "invalid" });
        } else {
          var token = GenerateToken(res);
          return response.status(200).json({
            message: "success",
            email: res[0].email,
            username: res[0].username,
            token: token,
          });
        }
      }
    }
  );
}

module.exports = {
  AdminLogin,
};
