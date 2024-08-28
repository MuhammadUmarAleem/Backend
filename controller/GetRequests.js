const { connection } = require("../utils/database");

async function GetRequests(req, response) {
  try {
    connection.query(`SELECT  requeststojoin.id,event.title,requeststojoin.status,users.firstname,users.lastname,users.userimage,event.image from requeststojoin Join event on event.id = requeststojoin.eventId Join users on users.id = requeststojoin.userId Where event.userId IN (Select id from users where users.email = '${req.query.email}') `, (err, res) => {
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
    GetRequests,
};
