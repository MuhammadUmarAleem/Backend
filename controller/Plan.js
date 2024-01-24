const crypto = require("crypto");
const { connection } = require("../utils/database");
const strftime = require("strftime");
async function Plan(req, response) {
  const plannumber = req.query.plannumber;
  const investmentperiod = req.query.investmentperiod;
  const gainratio = req.query.gainratio;
  const amount = req.query.amount;
  const email = req.query.email;
  const now = new Date();
  const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);


  connection.query(`SELECT * FROM users WHERE email='${email}'`, (err, res) => {
    if (err) throw err;
    else {
      if (res.length != 0) {
        const data = {
          plannumber: plannumber,
          investmentperiod: investmentperiod,
          gainratio: gainratio,
          amount: amount,
          userid: res[0].id,
          createdt: dateCreated,
        };
        connection.query("INSERT INTO plan SET ?", data, (err, res) => {
          if (err) throw err;
          else {
            response.status(200).json({ message: [email] });
          }
        });
      } else {
        response.status(200).json({ message: "already" });
      }
    }
  });
}

module.exports = {
  Plan,
};
