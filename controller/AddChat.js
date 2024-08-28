const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const { serialize } = require("cookie");
const emailer = require("./sendEmail");

async function AddChat(req, response) {
  const User1 = req.query.user1;
  const User2 = req.query.user2;
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  const data = {
    User1: User1,
    User2: User2,
    createdAt: dateCreated,
  };

  connection.query(
    `SELECT * FROM Chat WHERE User1='${User1}' and User2='${User2}' `,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          connection.query("INSERT INTO Chat SET ?", data, (err, res) => {
            if (err) throw err;
            else {
              async function send() {
                response
                  .status(200)
                  .json({ message: "sent"});
              }
              // Call the send function
              send();
            }
          });
        } else {
          response.status(200).json({ message: "already" });
        }
      }
    }
  );
}

module.exports = {
  AddChat,
};
