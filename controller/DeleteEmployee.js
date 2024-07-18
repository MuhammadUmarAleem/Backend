const { connection } = require("../utils/database");

async function DeleteEmployee(req, response) {
  try {
    connection.query(
      `UPDATE Users
      SET Users.Active = 0
      WHERE Users.ID = ${req.query.id} AND Role = 'Employee';
      
    `,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
            return response.status(200).json({ message: "deleted" });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  DeleteEmployee,
};
