const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function updateInventoryStatus(req, response) {
  try {
    const status = req.body.status;
    const id = req.body.id;
    connection.query(
      `UPDATE course SET active=${status} WHERE id=${id}`,
      (err, res) => {
        if (err) {
          logs.log(err, "Admin", "/changeCourseStatus");
          return;
        } else {
          return response.status(200).json({
            message: "updated",
          });
        }
      }
    );
  } catch (err) {
    logs.log(err, "Admin", "/changeCourseStatus");
  }
}

module.exports = {
  updateInventoryStatus,
};
