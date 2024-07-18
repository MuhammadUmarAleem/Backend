const crypto = require("crypto");
const { connection } = require("../utils/database");

async function CreateTeam(req, response) {
  const Title = req.body.Title;
  const LeadId = req.body.LeadId;

  const data = {
    Title: Title,
    LeadId: LeadId,
  };
console.log(data)
  connection.query(`SELECT * FROM Teams WHERE Title='${Title}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length === 0) {
        connection.query("INSERT INTO Teams SET ?", data, (err, res) => {
          if (err) throw err;
          else {
            response
              .status(200)
              .json({ message: "created"});
          }
        });
      } else {
        response.status(200).json({ message: "already" });
      }
    }
  });
}

module.exports = {
  CreateTeam,
};
