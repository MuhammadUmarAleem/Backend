const { connection } = require("../utils/database");

async function GetUserData(req, response) {
  try {
    connection.query(
      `SELECT *
    FROM Users 
    Where Email = '${req.query.Email}'
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
    GetUserData,
};
