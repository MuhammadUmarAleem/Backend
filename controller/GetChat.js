const { connection } = require("../utils/database");

async function GetChat(req, response) {
  try {
    connection.query(`SELECT  * from Chat join users on users.email = Chat.User2 where Chat.User1 = '${req.query.email}' UNION SELECT  * from Chat join users on users.email = Chat.User1 where Chat.User2 = '${req.query.email}'`, (err, res) => {
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
    GetChat,
};
