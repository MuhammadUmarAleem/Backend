const { connection } = require("../utils/database");

async function GetAssignedTickets(req, response) {
  try {
    const Id = req.query.id
    connection.query(
      `Select * from Tickets Where EmployeeId = ${Id}`,
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
    GetAssignedTickets,
};
