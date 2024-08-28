const { connection } = require("../../utils/database");

async function GetEvent(req, response) {
  try {
    const id = req.query.id;
    connection.query(`SELECT  *,event.id as id from event Join users on users.id = event.userId Where event.active = 1 and event.id = ${id} ORDER BY event.createdAt DESC `, (err, res) => {
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
    GetEvent,
};
