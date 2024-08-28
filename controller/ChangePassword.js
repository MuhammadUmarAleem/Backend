// Import required modules
const strftime = require("strftime");
const { connection } = require("../utils/database");
const crypto = require("crypto");

// Function to add inventory
async function ChangePassword(req, response) {
  try {
    // Extract data from the request
    const password = crypto
      .createHash("sha256")
      .update(req.query.oldpassword)
      .digest("hex");
    const oldpassword = req.query.oldpassword;
    const newpassword = crypto
      .createHash("sha256")
      .update(req.query.newpassword)
      .digest("hex");
    const email = req.query.email;
    const now = new Date();
    const dated = strftime("%Y-%m-%d %H:%M:%S", now);
    console.log(oldpassword, newpassword, email, dated);

    console.log(
      `SELECT * FROM users WHERE email='${email}' and password = '${password}'`
    );
    connection.query(
      `SELECT * FROM users WHERE email='${email}' and password = '${password}'`,
      (err, res) => {
        if (err) {
          // Log an error if there's an issue with the database query
          console.log("error1");
          return;
        } else {
          // Insert data into the 'course' table
          if (res && res.length > 0 && res[0].id !== undefined) {
            connection.query(
              `UPDATE users
          SET password = '${newpassword}', updatedAt = '${dated}'
          WHERE id = ${res[0].id}`,
              (err, res) => {
                if (err) {
                  // Log an error if there's an issue with the database query
                  console.log("error2");
                  console.log(err);
                  return;
                } else {
                  console.log("done1");

                  return response.status(200).json({ message: "updated" });
                }
              }
            );
          } else {
            return response.status(200).json({ message: "not" });
          }
        }
      }
    );
  } catch (err) {
    // Log an error if there's an exception in the try block
    console.log(err, "Admin", "/addCourse");
    return response.status(200).json({ message: "not" });
  }
}

// Export the function for external use
module.exports = {
  ChangePassword,
};
