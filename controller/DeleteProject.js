const { connection } = require("../utils/database");

async function DeleteProject(req, response) {
  try {
    connection.query(
      `UPDATE Projects
      SET Projects.Active = 0
      WHERE Projects.Id = ${req.query.id};
    `,
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
            return response.status(200).json({ message: "deleted" });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  DeleteProject,
};
