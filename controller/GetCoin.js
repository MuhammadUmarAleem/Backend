const { connection } = require("../utils/database");

async function   GetCoin(req, response) {
  try {
    connection.query(
      `Select * from Coin
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
    GetCoin,
};
