const { connection } = require("../utils/database");

async function GetLatestWithdrawals(req, response) {
  try {
    connection.query(
      `Select Temp.User as Username, Temp.Amount,Temp.CreatedAt  from Temp ORDER BY Temp.CreatedAt DESC    
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
    GetLatestWithdrawals,
};
