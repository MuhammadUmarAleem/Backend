const { connection } = require("../utils/database");

async function GetLottery(req, response) {
  try {
    connection.query(
      `SELECT * FROM lottery join users on lottery.userid = users.id`,
      (err, res) => {
        if (err) {
            console.log(err)
          return;
        } else {
          console.log(res);
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    console.log(err, "user", "/GetLottery");
  }
}

module.exports = {
    GetLottery,
};
