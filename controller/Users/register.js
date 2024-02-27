// Import necessary modules
const strftime = require("strftime");
const crypto = require("crypto");
const { connection } = require("../../utils/database");
const emailer = require("./sendEmail");
const logs = require("../Admin/log");

// Define the registration function
async function Register(req, response) {
  try {
    // Extract user information from the request body
    const username = req.body.username;
    const email = req.body.email;
    // Hash the password using SHA-256 algorithm
    const password = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("hex");
    const role = "User";
    // Get the current date and time
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    // Prepare user data object for database insertion
    const data = {
      username: username,
      email: email,
      password: password,
      role: role,
      createdAt: dateCreated,
      updatedAt: dateCreated,
      active: false,
    };

    // Check if the email is already registered
    connection.query(
      `SELECT * FROM users WHERE email='${email}'`,
      (err, res) => {
        if (err) {
          // Log any database query errors
          logs.log(err, "user", "/register");
          return;
        } else {
          if (res.length == 0) {
            // If email is not registered, insert user data into the database
            connection.query("INSERT INTO users SET ?", data, (err, res) => {
              if (err) {
                // Log any database insertion errors
                logs.log(err, "user", "/register");
                return;
              } else {
                // Generate a random verification code and send it via email
                const code = emailer.generateRandomNumber();
                const subject = "Verify Your Account";
                const body = `<p>Dear User!<p><p> Thanks for your interest in Wise Way. To create your account, verify your email. Your Verification Code is <br/> <center><h1>${code}</h1></center>`;
                
                // Function to send the verification email
                async function send() {
                  const responseData = await emailer.sendEmail(
                    email,
                    subject,
                    body
                  );
                  // Hash the verification code for security
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
            // If email is already registered, send a response indicating so
            response.status(200).json({ message: "already" });
          }
        }
      }
    );
  } catch (err) {
    // Log any unexpected errors during registration
    logs.log(err, "user", "/register");
  }
}

// Export the registration function
module.exports = {
  Register,
};
