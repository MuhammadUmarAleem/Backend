const { connection } = require("../../utils/database");
const logs = require("../Admin/log");
async function updateAdmin(req, response) {
  try {
    console.log(req.body);
    const name = req.body.username;
    const email = req.body.email;

    connection.query(
      `UPDATE users SET username='${name}',email='${email}' WHERE id=2`,
      (err, res) => {
        if (err) {
          logs.log(err, "Admin", "/updateAdmin");
          return;
        } else {
          return response.status(200).json({ message: "updated" });
        }
      }
    );
  } catch (err) {
    logs.log(err, "Admin", "/updateAdmin");
  }
}

module.exports = {
  updateAdmin,
};
