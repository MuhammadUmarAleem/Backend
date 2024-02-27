const { connection } = require("../../utils/database");
const logs = require("../Admin/log");
const strftime = require("strftime");

async function deleteInventory(req, response) {
  try {
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    connection.query(
      `SELECT * FROM course WHERE id=${req.query.id}`,
      (err, res) => {
        if (err) {
          logs.log(err, "Admin", "/deleteCourse");
          return;
        } else {
          connection.query(
            "INSERT INTO course_audit (userid, action, oldValue, newValue,dated) VALUES (?, ?, ?, ?,?)",
            [
              2,
              "DELETE",
              JSON.stringify({ product: res[0] }),
              "N/A",
              dateCreated,
            ],
            (err, auditResult) => {
              if (err) {
                logs.log(err, "Admin", "/deleteCourse");
                return;
              } else {
                connection.query(
                  `DELETE from course where id=${req.query.id}`,
                  (err, res) => {
                    if (err) throw err;
                    else {
                      return response.status(200).json({ message: "deleted" });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    logs.log(err, "Admin", "/deleteCourse");
  }
}

module.exports = {
  deleteInventory,
};
