const crypto = require("crypto");
const { connection } = require("../utils/database");

async function Bot(req, response) {
  const Amount = req.query.Amount;
  const Email = req.query.Email;
  connection.query(`SELECT * FROM Users WHERE Email='${Email}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        const data = {
          Amount: Amount,
          UserId: res[0].Id,
        };
        const newBotCredit = parseFloat(res[0].BotCredit) - parseFloat(data.Amount)
        connection.query("INSERT INTO Bot SET ?", data, (err, res) => {
          if (err) throw err;
          else {
            connection.query(`UPDATE Users
            SET BotCredit = '${newBotCredit}'
            WHERE Id = ${data.UserId};
            `, (err, res) => {
              if (err) throw err;
              else {
                response.status(200).json({ message: "okay" });
              }
            });
          }
        });
      } else {
        response.status(200).json({ message: "already" });
      }
    }
  });
}

module.exports = {
  Bot,
};
