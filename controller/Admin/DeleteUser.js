// Import required modules
const { connection } = require("../../utils/database");

// Function to delete a user
async function DeleteUser(req, response) {
  try {
    // Extract email from the request body
    const { email } = req.query;

    console.log(`SELECT * FROM users WHERE email='${email}'`);
    connection.query(
      `SELECT * FROM users WHERE email='${email}'`,
      (err, res) => {
        if (err) {
          console.log("error1");
          return;
        } else if (res.length === 0) {
          return response.status(404).json({ message: "User not found" });
        } else {
          const userId = res[0].id;

          // Delete from the 'profile' table
          connection.query(
            `DELETE FROM profile WHERE userid=${userId}`,
            (err, res) => {
              if (err) {
                console.log("error2");
                console.log(err);
                return;
              } else {
                console.log("Profile deleted");

                // Delete from the 'users' table
                connection.query(
                  `DELETE FROM users WHERE id=${userId}`,
                  (err, res) => {
                    if (err) {
                      console.log("error3");
                      console.log(err);
                      return;
                    } else {
                      console.log("User deleted");
                      return response.status(200).json({ message: "User deleted successfully" });
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
    console.log(err, "Admin", "/DeleteUser");
  }
}

// Export the function for external use
module.exports = {
  DeleteUser,
};
