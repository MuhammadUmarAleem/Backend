const { connection } = require("../utils/database");

async function UpdateBalance(req, response) {
  const Balance = req.query.Balance;
  const ProfitP = req.query.ProfitP;
  const ProfitR = req.query.ProfitR;
  const StatBalance = req.query.StatBalance;
  const BotCredit = req.query.BotCredit;
  const CashoutCredit = req.query.CashoutCredit;
  const UserId = req.query.UserId;
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
}

module.exports = {
  UpdateBalance,
};
