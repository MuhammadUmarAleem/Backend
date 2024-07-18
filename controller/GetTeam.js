const { connection } = require("../utils/database");

async function GetTeam(req, response) {
  try {
    const Id = req.query.id
    connection.query(
      `Select * from Teams Where Id = ${Id} `,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
            if (res.length === 0) {
                return response.status(200).json({ message: "User Not Exist" });
              }
              else{
                connection.query(
                    `Select Distinct Users.*, Employees.* from Teams Join Employees On Employees.TeamId = Teams.Id Join Users ON Users.Id = Employees.UserId Where Teams.Id = ${Id}
                  `,
                    (err, resp) => {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                          return response.status(200).json({ Team: res, Members: resp });
                      }
                    }
                  );
                }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  GetTeam,
};
