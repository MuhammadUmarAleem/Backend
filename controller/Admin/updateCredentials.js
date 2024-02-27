const crypto = require("crypto");
const { connection } = require("../../utils/database");
const logs = require('../Admin/log');
async function updateCredentials(req, response) {
  try{
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  const newpass = crypto
    .createHash("sha256")
    .update(req.body.newpass)
    .digest("hex");

  connection.query(
    `SELECT * FROM users WHERE password='${password}' and id=2`,
    (err, res) => {
      if (err) {
        logs.log(err,'Admin','/updateCredentials');
        return;
      }
      else {
        if (res.length == 0) {
          return response.status(200).json({ message: "incorrect" });
        } else {
          connection.query(
            `UPDATE users SET password='${newpass}' WHERE id=2`,
            (err, res) => {
              if (err) {
                logs.log(err,'Admin','/updateCredentials');
                return;
              }
              else {
                return response.status(200).json({ message: "updated" });
              }
            }
          );
        }
      }
    }
  );
  }catch(err){
    logs.log(err,'Admin','/updateCredentials');
  }
}

module.exports = {
  updateCredentials,
};
