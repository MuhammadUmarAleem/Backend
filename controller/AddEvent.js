// Import required modules
const strftime = require("strftime");
const { connection } = require("../utils/database");

// Function to add inventory
async function AddEvent(req, response) {
  try {
    // Extract data from the request
    const title = req.body.title;
    const image = req.file.filename;
    const location = req.body.location;
    const date = req.body.date;
    let hide = null;
    const email = req.query.email;
    const description = req.body.description;
    const latitude = req.query.latitude;
    const longitude= req.query.longitude;
    // Get the current date and time
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);
    console.log(title,image,location,date,dateCreated,email);

    if(req.body.hide === 'true'){
      hide = true;
    }
    else{
      hide = false
    }

    connection.query(
      `SELECT * FROM users WHERE email='${email}'`,
      (err, res) => {
        if (err) {
          // Log an error if there's an issue with the database query
          console.log('error1')
          return;
        } else {
          // Prepare data for inserting into the 'course' table
          const data = {
            title: title,
            description: description,
            image: image,
            location: location,
            date: date,
            userId: res[0].id,
            latitude:latitude,
            longitude:longitude,
            createdAt: dateCreated,
            updatedAt: dateCreated,
            hide:hide,
            active: true,
          };

          // Insert data into the 'course' table
          connection.query("INSERT INTO event SET ?", data, (err, res) => {
            if (err) {
              // Log an error if there's an issue with the database query
              console.log('error2')
              console.log(err)
              return;
            } else {
                console.log('done')
                return response.status(200).json({ message: "added" });
            }
          });
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
  AddEvent,
};
