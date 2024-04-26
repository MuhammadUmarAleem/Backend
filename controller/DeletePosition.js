const { connection } = require("../utils/database");

async function   DeletePosition(req, response) {
  try {
    connection.query(
      `DELETE from Positions where Id=${req.query.Id}
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
  DeletePosition,
};
