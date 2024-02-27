const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function UpdateStatus(req, response) {
  try {
    const status = req.body.status;
    console.log(status);
    const id = req.body.id;
    connection.query(
      `UPDATE instructor SET active=${status} WHERE Id=${id}`,
      (err, res) => {
        if (err) {
          logs.log(err, "Admin", "/changeStatus");
          return;
        } else {
          return response.status(200).json({
            message: "updated",
          });
        }
      }
    );
  } catch (err) {
    logs.log(err, "Admin", "/changeStatus");
  }
}

module.exports = {
  UpdateStatus,
};
