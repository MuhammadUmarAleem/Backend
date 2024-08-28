const strftime = require("strftime");
const { connection } = require("../../utils/database");
const path = require("path");
const fs = require("fs");

async function EditUser(req, response) {
  try {
    const { firstname, lastname, email, phoneno, mobile, country, city, address } = req.body;
    const now = new Date();
    const dated = strftime("%Y-%m-%d %H:%M:%S", now);
    const image = req.file; // Get the uploaded image from multer

    // First, find the user by email
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, res) => {
      if (err) {
        console.log("error1");
        return response.status(500).json({ message: "Internal server error" });
      } else if (res.length === 0) {
        return response.status(404).json({ message: "User not found" });
      } else {
        const id = res[0].id;
        let imagePath = null;

        // Move the uploaded image to the uploads directory if available
        if (image) {
          imagePath = image.filename; // Store the filename only
        }

        // Update the userimage field in the users table
        connection.query(
          `UPDATE users
            SET firstname = ?, lastname = ?, updatedAt = ?${imagePath ? ', userimage = ?' : ''}
            WHERE id = ?`,
          [firstname, lastname, dated, ...(imagePath ? [imagePath] : []), id],
          (err, res) => {
            if (err) {
              console.log("error2");
              console.log(err);
              return response.status(500).json({ message: "Internal server error" });
            } else {
              console.log("done1");

              // Update other user details in the profile table
              connection.query(
                `UPDATE profile
                  SET phoneno = ?,
                      mobile = ?,
                      country = ?,
                      city = ?,
                      address = ?,
                      updatedAt = ?
                  WHERE userid = ?`,
                [phoneno, mobile, country, city, address, dated, id],
                (err, res) => {
                  if (err) {
                    console.log("error3");
                    console.log(err);
                    return response.status(500).json({ message: "Internal server error" });
                  } else {
                    console.log("done2");
                    return response.status(200).json({ message: "User updated successfully" });
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err, "Admin", "/EditUser");
    return response.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  EditUser,
};
