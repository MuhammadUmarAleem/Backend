const { connection } = require("../utils/database");
async function GetRealms(req, response) {
  try {
    connection.query(
      `SELECT realms.id,realms.name from realms JOIN companies on realms.company_id=companies.id`,
      (err, res) => {
        if (err) {
          return;
        } else {
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    logs.log(err, "/GetRealms");
  }
}

module.exports = {
  GetRealms,
};
