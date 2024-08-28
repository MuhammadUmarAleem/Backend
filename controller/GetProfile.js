const { connection } = require("../utils/database");

async function GetProfile(req, response) {
  try {
    connection.query(
      `SELECT  * from profile join users on users.id = profile.userid where users.email = '${req.query.email}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log(res);
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  GetProfile,
};
