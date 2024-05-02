const { connection } = require("../utils/database");

async function   GetAdminWithdraw(req, response) {
  try {
    connection.query(
      `SELECT Users.Username as Username, Withdraw.Currency as Currency , Withdraw.Amount as Amounts,
       Withdraw.Address as Address , Withdraw.CreatedAt as Date
    FROM Withdraw 
    JOIN Users ON Users.Id = Withdraw.UserId 
    Where Users.Active = 1
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
    GetAdminWithdraw,
};
