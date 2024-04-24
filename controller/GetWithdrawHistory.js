const { connection } = require("../utils/database");

async function   GetWithdrawHistory(req, response) {
  try {
    connection.query(
      `SELECT Withdraw.Id as Id, Withdraw.Amount as Amount
    FROM Withdraw 
    JOIN Users ON Users.Id = Withdraw.UserId 
    Where Users.Email = '${req.query.Email}'
    ORDER BY Withdraw.CreatedAt DESC
    `,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    GetWithdrawHistory,
};
