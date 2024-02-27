const { connection } = require("../../utils/database");
const logs = require("../Admin/log");
async function GetInventory(req, response) {
  try {
    connection.query(
      "SELECT course.id, course.name,course.image, course.price,course.description,instructor.instructorName,course.createdAt,course.updatedAt,course.active from course JOIN instructor on instructor.id=course.instructorid",
      (err, res) => {
        if (err) {
          logs.log(err, "Admin", "/getCourse");
          return;
        } else {
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    logs.log(err, "Admin", "/getCourse");
  }
}

module.exports = {
  GetInventory,
};
