// Import required modules
const strftime = require("strftime");
const { connection } = require("../utils/database");

// Function to add inventory
async function EditProfile(req, response) {
  try {
    // Extract data from the request
    const firstname = req.query.firstname.trim();
    const lastname = req.query.lastname.trim();
    const email = req.query.email.trim();
    const phoneno = req.query.phoneno.trim();
    const mobile = req.query.mobile.trim();
    const country = req.query.country.trim();
    const city = req.query.city.trim();
    const address = req.query.address.trim();
    // Get the current date and time
    const now = new Date();
    const dated = strftime("%Y-%m-%d %H:%M:%S", now);
    console.log(
      firstname,
      lastname,
      email,
      mobile,
      phoneno,
      country,
      city,
      dated,
      address
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
            `UPDATE users
          SET firstname = '${firstname}', lastname = '${lastname}', updatedAt = '${dated}'
          WHERE id = ${res[0].id}`,
            (err, res) => {
              if (err) {
                // Log an error if there's an issue with the database query
                console.log("error2");
                console.log(err);
                return;
              } else {
                console.log("done1");
                connection.query(
                  `
                UPDATE profile
                SET
                  phoneno = '${phoneno}',
                  mobile = '${mobile}',
                  country = '${country}',
                  city = '${city}',
                  address = '${address}',
                  updatedAt = '${dated}'
                WHERE
                  userid = ${id};
              `,
                  (err, res) => {
                    if (err) {
                      // Log an error if there's an issue with the database query
                      console.log("error3");
                      console.log(err);
                      return;
                    } else {
                      console.log("done2");
                      return response.status(200).json({ message: "added" });
                    }
                  }
                );
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
    EditProfile,
};
