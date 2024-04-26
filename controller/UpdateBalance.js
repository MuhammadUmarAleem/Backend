const { connection } = require("../utils/database");

async function UpdateBalance(req, response) {
  const Balance = req.query.Balance;
  const ProfitP = req.query.ProfitP;
  const ProfitR = req.query.ProfitR;
  const StatBalance = req.query.StatBalance;
  const BotCredit = req.query.BotCredit;
  const CashoutCredit = req.query.CashoutCredit;
  const BotId = req.query.BotId;
  connection.query(
    `SELECT Users.Id FROM Users Join Bot On Bot.UserId = Users.Id WHERE Bot.Id=${BotId}`,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length != 0) {
          var UserId = res[0].Id;
          connection.query(
            `UPDATE Users
          SET Balance = '${Balance}', 
          ProfitP = '${ProfitP}', 
          ProfitR = '${ProfitR}', 
          StatBalance = '${StatBalance}', 
          BotCredit = '${BotCredit}', 
          CashoutCredit = '${CashoutCredit}'
          WHERE Id = '${UserId}';
          `,
            (err, res) => {
              if (err) throw err;
              else {
                response.status(200).json({ message: "okay" });
              }
            }
          );
        } else {
          response.status(200).json({ message: "already" });
        }
      } // <-- Added closing parenthesis here
    }
  );
}

module.exports = {
  UpdateBalance,
};
