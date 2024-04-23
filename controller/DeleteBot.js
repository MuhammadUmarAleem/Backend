const { connection } = require("../utils/database");

async function   DeleteBot(req, response) {
  try {
    connection.query(
      `DELETE from Bot where Id=${req.query.Id}
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
  DeleteBot,
};
