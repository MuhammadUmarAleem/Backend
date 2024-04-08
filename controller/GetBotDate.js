const { connection } = require("../utils/database");

async function GetBotDate(req, response) {
  try {
    connection.query(
      `SELECT Bot.CreatedAt 
    FROM Bot 
    JOIN Users ON Users.Id = Bot.UserId 
    WHERE Users.Email = '${req.query.email}'
    ORDER BY Bot.CreatedAt DESC
    LIMIT 1;
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
  GetBotDate,
};
