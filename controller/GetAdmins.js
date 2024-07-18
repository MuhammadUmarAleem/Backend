const { connection } = require("../utils/database");

async function GetAdmins(req, response) {
  try {
    connection.query(
      `Select Users.Id as UserId,Users.FirstName, Users.LastName, Users.Email, Users.Active as Status from Users  Where Users.Role = 'Admin'  `,
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
  GetAdmins,
};
