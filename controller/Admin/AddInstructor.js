const strftime = require("strftime");
const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function AddBrand(req, response) {
  try {
    console.log(req.body);
    const name = req.body.name;
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    const data = {
      instructorName: name,
      createdAt: dateCreated,
      updatedAt: dateCreated,
      active: true,
    };

    connection.query("INSERT INTO instructor SET ?", data, (err, res) => {
      if (err) {
        logs.log(err, "Admin", "/addInstructor");
        return;
      } else {
        connection.query("Select max(id) as Id from instructor", (err, res) => {
          if (err) {
            logs.log(err, "Admin", "/addInstructor");
            return;
          } else {
            const audit = {
              userId: res[0].Id,
              action: "INSERT",
              oldValue: "N/A",
              newValue: JSON.stringify(data),
              dated: dateCreated,
            };
            connection.query(
              "INSERT INTO instructor_audit SET ?",
              audit,
              (err, res) => {
                if (err) {
                  logs.log(err, "Admin", "/addInstructor");
                  return;
                } else {
                  return response.status(200).json({ message: "added" });
                }
              }
            );
          }
        });
      }
    });
  } catch (err) {
    logs.log(err, "Admin", "/addInstructor");
  }
}

module.exports = {
  AddBrand,
};
