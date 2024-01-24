const { connection } = require("../utils/database");

async function GetUsers(req, response) {
  try {
    connection.query(
      `SELECT * FROM users`,
      (err, res) => {
        if (err) {
            console.log(err)
          return;
        } else {
          console.log(res);
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err, "user", "/GetUsers");
  }
}

module.exports = {
    GetUsers,
};
