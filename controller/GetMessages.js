const { connection } = require("../utils/database");

async function GetMessages(req, response) {
  try {
    connection.query(`SELECT  * from Messages where ChatId = '${req.query.chatid}'`, (err, res) => {
      if (err) {
        console.log(err)
        return;
      } else {
        return response.status(200).json({ data: res });
      }
    });
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
    GetMessages,
};
