const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const emailer = require("./sendEmail");
const { serialize } = require("cookie");

async function Register(req, response) {
  const username = req.body.username;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  const address = req.body.address;
  const refnumber = req.body.refnumber;
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  const data = {
    username: username,
    name: name,
    surname: surname,
    email: email,
    password: password,
    address: address,
    refnumber: refnumber,
    role: false,
    createdAt: dateCreated,
    updatedAt: dateCreated,
    active: true,
  };

  connection.query(`SELECT * FROM users WHERE email='${email}' or username ='${username}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length == 0) {
        connection.query("INSERT INTO users SET ?", data, (err, res) => {
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
  Register,
};
