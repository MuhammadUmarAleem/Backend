const crypto = require("crypto");
const { connection } = require("../utils/database");

async function UpdateProfile(req, response) {
  const username = req.body.username;
  const email = req.body.email;
  const name = req.body.name;
  const address = req.body.address;
  const refnumber = req.body.refnumber;


  connection.query(`SELECT * FROM users WHERE email='${email}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        connection.query(`Update users Set username = '${username}',name = '${name}',address = '${address}',refnumber = '${refnumber}' where email = '${email}'`, (err, res) => {
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
    UpdateProfile,
};
