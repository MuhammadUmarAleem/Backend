const { connection } = require("../utils/database");

async function GetTickets(req, response) {
  try {
    connection.query(
      `Select * from Tickets Join Users On Users.ID = Tickets.EmployeeId`,
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
  GetTickets,
};
