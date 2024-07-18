const { connection } = require("../utils/database");

async function GetAssignedTicket(req, response) {
  try {
    const Id = req.query.id
    connection.query(
      `Select * from Tickets Where Tickets.Id = ${Id}`,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          connection.query(
            `Select * from Documents Where TaskId = ${Id}`,
            (err, resp) => {
              if (err) {
                console.log(err);
                return;
              } else {
                  return response.status(200).json({ ticket: res,documents: resp });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    GetAssignedTicket,
};
