const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../utils/database");
const { serialize } = require("cookie");
const emailer = require("./sendEmail");
const path = require("path");

async function SignUp(req, response) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

  // Check if user image is uploaded
  const userImagePath = req.file ? req.file.filename : null;

  const data = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    createdAt: dateCreated,
    updatedAt: dateCreated,
    active: false,
    userimage: userImagePath, // Save the image path in the database
  };

  connection.query(
    `SELECT * FROM users WHERE email='${email}'`,
    (err, res) => {
      if (err) throw err;
      else {
        if (res.length == 0) {
          connection.query("INSERT INTO users SET ?", data, (err, res) => {
            if (err) throw err;
            else {
              // Generate a random verification code and send it via email
              const code = emailer.generateRandomNumber();
              const subject = "Verify Your Account";
              const body = `<p>Dear User!<p><p> Thanks for your interest in Boongombia. To create your account, verify your email. Your Verification Code is <br/> <center><h1>${code}</h1></center>`;
              
              // Function to send the verification email
              async function send() {
                const responseData = await emailer.sendEmail(
                  email,
                  subject,
                  body
                );
                // Hash the verification code for security
                console.log('send email')
                const hashed = crypto
                  .createHash("sha256")
                  .update(code.toString())
                  .digest("hex");
                // Send a response with success message and hashed code
                response
                  .status(200)
                  .json({ message: "sent", email: email, code: hashed });
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
  SignUp,
};
