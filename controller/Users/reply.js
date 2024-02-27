const strftime = require("strftime");
const { connection } = require("../../utils/database");
const emailer = require("./sendEmail");
const logs = require("../Admin/log");

async function reply(req, response) {
  try {
    const email = req.body.email;
    const subject = req.body.subject;
    const reply = req.body.reply;
    const id = req.body.id;

    connection.query(
      `UPDATE support SET replied=true WHERE id=${id}`,
      (err, res) => {
        if (err) {
          logs.log(err, "user", "/reply");
          return;
        } else {
          async function send() {
            const responseData = await emailer.sendEmail(email, subject, reply);
            response.status(200).json({ message: "added" });
          }
          send();
        }
      }
    );
  } catch (err) {
    logs.log(err, "user", "/reply");
  }
}

module.exports = {
  reply,
};
