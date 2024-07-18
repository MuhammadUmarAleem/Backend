const { connection } = require("../utils/database");

async function GetTicket(req, response) {
  try {
    const Id = req.query.id
    connection.query(
      `Select * from Tickets Left Join Documents ON Documents.TaskId = Tickets.Id Where Tickets.Id = ${Id}`,
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
  GetTicket,
};
