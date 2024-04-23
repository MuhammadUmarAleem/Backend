const { connection } = require("../utils/database");

async function   GetAllBots(req, response) {
  try {
    connection.query(
      `SELECT Bot.Id as Id,Users.Id as UserId ,Users.Username,Bot.Amount,Bot.CreatedAt
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
  GetAllBots,
};
