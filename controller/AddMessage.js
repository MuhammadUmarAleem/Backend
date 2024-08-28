const strftime = require("strftime");
const { connection } = require("../utils/database");

async function AddMessage(req, response) {
  const ChatId = req.query.chatid;
  const Message = req.query.message;
  const User = req.query.user;
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  const data = {
    ChatId: parseInt(ChatId),
    Message: Message,
    User: User,
    createdAt: dateCreated,
  };

  connection.query("INSERT INTO Messages SET ?", data, (err, res) => {
    if (err) throw err;
    else {
      response.status(200).json({ message: "sent" });
    }
  });
}

module.exports = {
  AddMessage,
};
