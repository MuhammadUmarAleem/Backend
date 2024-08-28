const { connection } = require("../../utils/database");

async function GetDashboardEvents(req, response) {
  try {
    connection.query("SELECT  *,event.id as id from event Join users on users.id = event.userId WHERE DATE(event.createdAt) = CURDATE() and event.active = 1", (err, res) => {
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
    GetDashboardEvents,
};
