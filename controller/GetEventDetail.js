const { connection } = require("../utils/database");

async function GetEvents(req, response) {
  try {
    connection.query(`SELECT *, event.id as id from event join users on users.id = event.userId where event.id = ${req.query.id}`, (err, res) => {
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
