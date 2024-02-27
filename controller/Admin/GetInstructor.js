const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function GetBrands(req, response) {
  try {
    connection.query("SELECT  * from instructor", (err, res) => {
      if (err) {
        logs.log(err, "Admin", "/GetInstructor");
        return;
      } else {
        return response.status(200).json({ data: res });
      }
    });
  } catch (err) {
    logs.log(err, "Admin", "/GetInstructor");
  }
}

module.exports = {
  GetBrands,
};
