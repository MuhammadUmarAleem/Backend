const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const emailer = require("./sendEmail");
const { serialize } = require("cookie");

async function Subscribe(req, response) {
  const email = req.query.email;
  const now = new Date();
  const CreatedAt = strftime("%Y-%m-%d %H:%M:%S", now);

  const data = {
    email: email,
    CreatedAt: CreatedAt,
  };

  connection.query(
    `SELECT * FROM subscribe WHERE email='${email}'`,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          connection.query("INSERT INTO subscribe SET ?", data, (err, res) => {
            if (err) throw err;
            else {
              response.status(200).json({ message: [email] });
            }
          });
        } else {
          response.status(200).json({ message: "already" });
        }
      }
    }
  );
}

module.exports = {
  Subscribe,
};
