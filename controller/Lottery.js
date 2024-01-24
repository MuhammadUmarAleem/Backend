const crypto = require("crypto");
const { connection } = require("../utils/database");
const strftime = require("strftime");
async function Lottery(req, response) {
  const email = req.query.email;
  const quantity = req.query.quantity;
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  connection.query(`SELECT * FROM users WHERE email='${email}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        const data = {
          tickets: quantity,
          price: quantity,
          userid: res[0].id,
          createdt: dateCreated,
        };
        connection.query("INSERT INTO lottery SET ?", data, (err, res) => {
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
  Lottery,
};
