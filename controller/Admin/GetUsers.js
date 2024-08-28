const { connection } = require("../../utils/database");

async function GetUsers(req, response) {
  try {
    connection.query("SELECT  * from users left Join profile ON profile.userid=users.id ORDER BY users.createdAt DESC", (err, res) => {
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
    GetUsers,
};
