const strftime = require("strftime");
const { connection } = require("../../utils/database");
const logs = require('../Admin/log');
async function updateBrand(req, response) {
  try{
  const name = req.body.name;
  const id = req.body.id;
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);
  let oldValue = {};

  connection.query(`SELECT * FROM instructor WHERE Id=${id}`, (err, res) => {
    if (err) {
      logs.log(err,'Admin','/updateInstructor');
      return;
    }
    else {
      oldValue = res[0];
      connection.query(
        "INSERT INTO instructor_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)",
        [
          2,
          "UPDATE",
          JSON.stringify(oldValue),
          JSON.stringify({ brandName: name }),
          dateCreated,
        ],
        (err, auditResult) => {
          if (err) {
            logs.log(err,'Admin','/updateInstructor');
            return;
          } else {
            connection.query(
              `UPDATE instructor SET instructorName='${name}',updatedAt='${dateCreated}' WHERE Id=${id}`,
              (err, res) => {
                if (err) {
                  logs.log(err,'Admin','/updateInstructor');
                  return;
                }
                else {
                  return response.status(200).json({ message: "updated" });
                }
              }
            );
          }
        }
      );
    }
  });
}catch(err){
  logs.log(err,'Admin','/updateInstructor');
}
}

module.exports = {
  updateBrand,
};
