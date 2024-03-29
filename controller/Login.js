const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connection } = require("../utils/database");

function GenerateToken(user) {
  const payload = {
    // role: user.role,
    id: user.Id,
    email: user.Email
  };
  const token = jwt.sign(payload, "123456asdfghjkljasjdhgasdyt6rt2376tuasgd");
  return token;
}

async function Login(req, response) {
  console.log(req.query.email,req.query.password)
  const email = req.query.email;
  const password = crypto
    .createHash("sha256")
    .update(req.query.password)
    .digest("hex");

  connection.query(
    `
    SELECT Id,Email FROM Companies 
    WHERE Email='${email}' AND Password='${password}' and Active = true
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
