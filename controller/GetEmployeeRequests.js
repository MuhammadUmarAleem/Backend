const { connection } = require("../utils/database");

async function GetEmployeeRequests(req, response) {
    const Id = req.query.id
  try {
    connection.query(
      `Select * from Requests Where EmployeeId = ${Id}`,
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
    GetEmployeeRequests,
};
