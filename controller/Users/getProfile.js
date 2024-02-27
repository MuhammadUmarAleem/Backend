const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function getProfile(req, response) {
  try {
    const id = req.query.id;
    connection.query(`SELECT * FROM users WHERE Id=${id}`, (err, res) => {
      if (err) {
        logs.log(err, "user", "/getProfile");
        return;
      } else {
        return response.status(200).json({ data: res });
      }
    });
  } catch (err) {
    logs.log(err, "user", "/getProfile");
  }
}

module.exports = {
  getProfile,
};
