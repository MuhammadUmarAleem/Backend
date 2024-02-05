const crypto = require("crypto");
const { connection } = require("../utils/database");
const strftime = require("strftime");
const emailer = require("./sendEmail");

async function Verify(req, response) {
  try {
    const email = req.query.email;
    const code = req.query.auth;
    const hash = crypto
      .createHash("sha256")
      .update(req.body.code)
      .digest("hex");
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    if (code != hash) {
      response.status(200).json({ message: "invalid" });
    } else {
      connection.query(
        `UPDATE users SET active=true WHERE email='${email}'`,
        (err, res) => {
          if (err) {
            return;
          } else {
            connection.query(
              `SELECT * FROM users WHERE email='${email}'`,
              (err, res) => {
                if (err) {
                  return;
                } else {
                  async function send() {
                    const subject = "Your Account has been verified";
                    const body =
                      "Thanks for registering on Evently. Your email has been verified";
                    const responseData = await emailer.sendEmail(
                      email,
                      subject,
                      body
                    );
                    response.status(200).json({ message: "verified" });
                  }
                  send();
                }
              }
            );
          }
        }
      );
    }
  } catch (err) {
    console.log(err, "user", "/Verify");
  }
}

module.exports = {
  Verify,
};
