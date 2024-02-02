const { connection } = require("../utils/database");

async function GetLocations(req, response) {
  try {
    connection.query("SELECT location from event", (err, res) => {
      if (err) {
        console.log(err)
        return;
      } else {
        return response.status(200).json({ data: res });
      }
    });
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
    GetLocations,
};
