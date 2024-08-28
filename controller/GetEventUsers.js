const { connection } = require("../utils/database");

async function GetEventUsers(req, response) {
  try {
    connection.query(`SELECT  * from requeststojoin join users on users.id = requeststojoin.userId where requeststojoin.eventId = ${req.query.id} and requeststojoin.status = 'Approved'`, (err, res) => {
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
    GetEventUsers,
};
