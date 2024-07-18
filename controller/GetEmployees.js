const { connection } = require("../utils/database");

async function GetEmployees(req, response) {
  try {
    connection.query(
      `Select Users.Id as EmployeeId,Users.FirstName, Users.LastName, Users.Email, Users.Active as Status from Users    `,
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
  GetEmployees,
};
