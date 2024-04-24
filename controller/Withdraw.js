const crypto = require("crypto");
const { connection } = require("../utils/database");

async function Withdraw(req, response) {
  const Amount = req.query.Amount;
  const Email = req.query.Email;
  const Currency = req.query.Currency;
  const Address = req.query.Address;
  connection.query(`SELECT * FROM Users WHERE Email='${Email}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        const data = {
          Address: Address,
          Currency: Currency,
          Amount: Amount,
          UserId: res[0].Id,
        };
        console.log(data);
        connection.query("INSERT INTO Withdraw SET ?", data, (err, res) => {
          if (err) throw err;
          else {
            response.status(200).json({ message: "okay" });
          }
        });
      } else {
        response.status(200).json({ message: "notalready" });
      }
    }
  });
}

module.exports = {
  Withdraw,
};
