const { connection } = require("../utils/database");

async function GetSocialMedia(req, response) {
  try {
    connection.query(
      `SELECT  * from socialmedia join users on users.id = socialmedia.userid where users.email = '${req.query.email}'`,
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
    GetSocialMedia,
};
