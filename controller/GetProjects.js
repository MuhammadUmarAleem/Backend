const { connection } = require("../utils/database");

async function GetProjects(req, response) {
  try {
    connection.query(
      `Select Projects.Id,Projects.Title,Projects.StartingDate,Projects.EndDate,Users.FirstName,Users.LastName,Projects.PMID from Projects Left Join Users ON Users.ID = Projects.PMId Where Projects.Active = true `,
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
    GetProjects,
};
