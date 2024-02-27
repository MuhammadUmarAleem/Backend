// Import required modules
const jwt = require("jsonwebtoken");
const strftime = require("strftime");
const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

// Function to add inventory
async function AddInventory(req, response) {
  try {
    // Extract data from the request
    const name = req.body.name;
    const image = req.file.filename;
    const price = req.body.price;
    const description = req.body.description;
    const brand = req.body.brand;
    
    // Get the current date and time
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    // Query the database to get the instructor with the specified name
    connection.query(
      `SELECT * FROM instructor WHERE instructorName='${brand}'`,
      (err, res) => {
        if (err) {
          // Log an error if there's an issue with the database query
          logs.log(err, "Admin", "/addCourse");
          return;
        } else {
          // Prepare data for inserting into the 'course' table
          const data = {
            name: name,
            price: price,
            description: description,
            image: image,
            instructorId: res[0].id,
            createdAt: dateCreated,
            updatedAt: dateCreated,
            active: true,
          };

          // Insert data into the 'course' table
          connection.query("INSERT INTO course SET ?", data, (err, res) => {
            if (err) {
              // Log an error if there's an issue with the database query
              logs.log(err, "Admin", "/addCourse");
              return;
            } else {
              // Prepare audit data for logging the insertion action
              const audit = {
                userId: 2,
                action: "INSERT",
                oldValue: "N/A",
                newValue: JSON.stringify(data),
                dated: dateCreated,
              };
              
              // Log the insertion action in the 'course_audit' table
              connection.query(
                "INSERT INTO course_audit SET ?",
                audit,
                (err, res) => {
                  if (err) throw err;
                  else {
                    // Respond with a success message if the operation is successful
                    return response.status(200).json({ message: "added" });
                  }
                }
              );
            }
          });
        }
      }
    );
  } catch (err) {
    // Log an error if there's an exception in the try block
    logs.log(err, "Admin", "/addCourse");
  }
}

// Export the function for external use
module.exports = {
  AddInventory,
};
