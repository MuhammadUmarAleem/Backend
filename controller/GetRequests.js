const { connection } = require("../utils/database");

async function GetRequests(req, response) {
  try {
    connection.query(
      `Select Requests.*,Users.FirstName,Users.LastName from Requests JOIN Employees On Employees.Id = Requests.EmployeeId JOIN Users ON Users.ID = Employees.UserId Where Requests.Active = true`,
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
    GetRequests,
};
