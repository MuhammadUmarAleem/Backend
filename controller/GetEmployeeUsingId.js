const { connection } = require("../utils/database");

async function GetEmployeesUsingId(req, response) {
  try {
    const Id = req.query.id
    connection.query(
      `Select * from Users Join Employees On Employees.UserId = Users.Id Where Users.Id = ${Id}
    `,
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
                `Select Distinct Projects.* from Projects Join Tickets On Tickets.ProjectId = Projects.Id Where Tickets.EmployeeId = ${res[0].Id}
              `,
                (err, resp) => {
                  if (err) {
                    console.log(err);
                    return;
                  } else {
                      return response.status(200).json({ EmployeeDetail: res, Projects: resp });
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
    GetEmployeesUsingId,
};
