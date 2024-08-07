const { connection } = require("../utils/database");

async function GetTeams(req, response) {
  try {
    connection.query(
      `Select Teams.*,Users.FirstName, Users.LastName from Teams Join Users ON Users.ID = Teams.LeadId`,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
            return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  GetTeams,
};
