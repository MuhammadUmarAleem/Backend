const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function support(req, response) {
  try {
    connection.query(`SELECT * FROM support`, (err, res) => {
      if (err) {
        logs.log(err, "user", "/getSupport");
        return;
      } else {
        return response.status(200).json({ data: res });
      }
    });
  } catch (err) {
    logs.log(err, "user", "/getSupport");
  }
}

module.exports = {
  support,
};
