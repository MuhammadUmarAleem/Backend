const { connection } = require("../utils/database");
async function GetCompany(req, response) {
  try {
    connection.query(
      `SELECT realms.id,companies.company,companies.founder,companies.personalnote,companies.compantdetails,companies.websiteurl,companies.founded from realms JOIN companies on realms.company_id=companies.id;`,
      (err, res) => {
        if (err) {
          return;
        } else {
            console.log(res);
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    logs.log(err, "/GetRealms");
  }
}

module.exports = {
  GetCompany,
};
