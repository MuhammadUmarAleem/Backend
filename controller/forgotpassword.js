const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const emailer = require("./sendEmail");
const { serialize } = require("cookie");

async function forgotpassword(req, response) {
  const username = req.body.username;
  const email = req.body.email;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  connection.query(`SELECT * FROM users WHERE email='${email}' and username ='${username}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        connection.query(`Update users Set password = '${password}' where username = '${username}'`, (err, res) => {
          if (err) throw err;
          else {
            response.status(200).json({ message: [email] });
          }
        });
      } else {
        response.status(200).json({ message: "already" });
      }
    }
  });
}

module.exports = {
    forgotpassword,
};
