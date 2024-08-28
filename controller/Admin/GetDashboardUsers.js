const { connection } = require("../../utils/database");

async function GetDashboardUsers(req, response) {
  try {
    connection.query(
      "SELECT * FROM users WHERE DATE(createdAt) = CURDATE()", 
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  GetDashboardUsers,
};
