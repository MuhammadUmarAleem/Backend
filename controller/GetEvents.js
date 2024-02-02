const { connection } = require("../utils/database");

async function GetEvents(req, response) {
  try {
    connection.query("SELECT  * from event", (err, res) => {
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
    GetEvents,
};
