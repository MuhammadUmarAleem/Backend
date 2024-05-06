const { connection } = require("../utils/database");

async function   GetAllBots(req, response) {
  try {
    connection.query(
      `SELECT Bot.Id as Id,
      Users.Id as UserId,
      Users.Username,
      Bot.Amount,
      Users.CreatedAt as Createdt,
      Bot.CreatedAt as CreatedAt
FROM Users
LEFT JOIN (
   SELECT UserId, MAX(Id) AS LatestBotId
   FROM Bot
   GROUP BY UserId
) AS LatestBot ON Users.Id = LatestBot.UserId
LEFT JOIN Bot ON LatestBot.LatestBotId = Bot.Id
WHERE Users.Active = 1
ORDER BY Users.CreatedAt DESC;

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
