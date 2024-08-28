const { connection } = require("../utils/database");

async function GetEventIdsRequest(req, response) {
  try {
    connection.query(`SELECT  requeststojoin.eventId,requeststojoin.status from requeststojoin Join users on users.id = requeststojoin.userId Where users.email = '${req.query.email}'`, (err, res) => {
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
    GetEventIdsRequest,
};
