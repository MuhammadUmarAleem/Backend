// Import required modules
const strftime = require("strftime");
const { connection } = require("../utils/database");

// Function to add inventory
async function EditSocial(req, response) {
  try {
    // Extract data from the request
    const twitter = req.query.twitter.trim();
    const instagram = req.query.instagram.trim();
    const facebook = req.query.facebook.trim();
    const email = req.query.email.trim();
    // Get the current date and time
    const now = new Date();
    const dated = strftime("%Y-%m-%d %H:%M:%S", now);
    console.log(
      twitter,
      instagram,
      facebook,
      email,
    );

    console.log(`SELECT * FROM users WHERE email='${email}'`);
    connection.query(
      `SELECT * FROM users WHERE email='${email}'`,
      (err, res) => {
        if (err) {
          // Log an error if there's an issue with the database query
          console.log("error1");
          return;
        } else {
            var id = res[0].id;
          // Insert data into the 'course' table
          connection.query(
            `UPDATE socialmedia
          SET twitter = '${twitter}', instagram = '${instagram}', facebook = '${facebook}', updatedAt = '${dated}'
          WHERE userid = ${res[0].id}`,
            (err, res) => {
              if (err) {
                // Log an error if there's an issue with the database query
                console.log("error2");
                console.log(err);
                return;
              } else {
                return response.status(200).json({ message: "added" });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    // Log an error if there's an exception in the try block
    console.log(err, "Admin", "/addCourse");
  }
}

// Export the function for external use
module.exports = {
    EditSocial,
};
