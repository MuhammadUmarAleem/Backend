const { connection } = require("../../utils/database");
const strftime = require("strftime");
const logs = require("../Admin/log");

async function buy(req, response) {
  try {
    const courseId = req.query.courseId;
    const userId = req.query.userId;
    const price = req.query.price;
    const now = new Date();
    const dateCreated = strftime("%Y-%m-%d %H:%M:%S", now);

    const data = {
      course_id: courseId,
      user_id: userId,
      price: price,
      dated: dateCreated,
    };

    connection.query("INSERT into enroll SET ?", data, (err, res) => {
      if (err) {
        logs.log(err, "user", "/buy");
        return;
      } else {
        response.redirect("http://localhost:3000/success");
      }
    });
  } catch (err) {
    logs.log(err, "user", "/buy");
  }
}

module.exports = {
  buy,
};
