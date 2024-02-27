const strftime = require("strftime");
const { connection } = require("../../utils/database");
const emailer = require("./sendEmail");
const logs = require("../Admin/log");

async function Support(req, response) {
  try {
    const email = req.body.email;
    const subject = req.body.subject;
    const body = req.body.body;
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    const data = {
      email: email,
      subject: subject,
      body: body,
      dated: dateCreated,
      replied: false,
    };

    connection.query("INSERT INTO support SET ?", data, (err, res) => {
      if (err) {
        logs.log(err, "user", "/support");
        return;
      } else {
        async function send() {
          const email = "muhammadumaraleem@gmail.com";
          const responseData = await emailer.sendEmail(email, subject, body);
          response.status(200).json({ message: "added" });
        }
        send();
      }
    });
  } catch (err) {
    logs.log(err, "user", "/support");
  }
}

module.exports = {
  Support,
};
