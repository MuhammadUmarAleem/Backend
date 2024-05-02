const { connection } = require("../utils/database");

async function UpdateCoin(req, response) {
  const Ethereum = req.query.Ethereum;
  const BTC = req.query.BTC;

  connection.query(
    `UPDATE Coin
          SET Ethereum = '${Ethereum}', 
          BTC = '${BTC}'
          WHERE Id = 1;
          `,
    (err, res) => {
      if (err) throw err;
      else {
        response.status(200).json({ message: "okay" });
      }
    }
  );
}

module.exports = {
  UpdateCoin,
};
