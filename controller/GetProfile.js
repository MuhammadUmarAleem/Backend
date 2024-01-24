const { connection } = require("../utils/database");

async function GetProfile(req, response) {
  try {
    connection.query(
      `SELECT * FROM users where email = '${req.query.email}'`,
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
    console.log(err, "user", "/GetProfile");
  }
}

module.exports = {
    GetProfile,
};
