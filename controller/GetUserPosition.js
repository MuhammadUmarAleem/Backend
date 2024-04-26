const { connection } = require("../utils/database");

async function GetUserPosition(req, response) {
  try {
    connection.query(
      `SELECT *
    FROM Positions 
    Join Users
    On Users.Id = Positions.UserId
    Where Users.Email = '${req.query.Email}'
    `,
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
    GetUserPosition,
};
