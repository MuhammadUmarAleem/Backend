const { connection } = require("../utils/database");

async function GetLatestWithdrawals(req, response) {
  try {
    connection.query(
      `SELECT Users.Username,Bot.Amount,Bot.CreatedAt 
    FROM Bot 
    JOIN Users ON Users.Id = Bot.UserId 
    ORDER BY Bot.CreatedAt DESC
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
    GetLatestWithdrawals,
};
