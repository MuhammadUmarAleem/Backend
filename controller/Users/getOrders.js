const { connection } = require("../../utils/database");
const logs = require("../Admin/log");

async function getOrders(req, response) {
  try {
    const userId = req.query.id;
    connection.query(
      `SELECT * from enroll JOIN users on users.id=enroll.user_id JOIN course on course.id=enroll.course_id JOIN instructor on instructor.id=course.instructorId WHERE users.id=${userId}`,
      (err, res) => {
        if (err) {
          logs.log(err, "user", "/getOrders");
          return;
        } else {
          console.log(res);
          return response.status(200).json({ data: res });
        }
      }
    );
  } catch (err) {
    logs.log(err, "user", "/getOrders");
  }
}

module.exports = {
  getOrders,
};
