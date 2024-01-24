const { connection } = require("../utils/database");

async function GetPlans(req, response) {
  try {
    connection.query(
      `SELECT * FROM plan join users on plan.userid = users.id`,
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
    console.log(err, "user", "/GetPlans");
  }
}

module.exports = {
    GetPlans,
};
