const strftime = require("strftime");
const { connection } = require("../utils/database");

async function deleteUser(req, response) {
  try {
    const id = req.query.id;


    console.log(id)

    connection.query(`DELETE from users where id=${id};
    `, (err, res) => {
      if (err) {
        return response.status(500).json({ message: "Internal Server Error" });
      }
      else {
        return response.status(200).json({ message: "deleted" });
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
    deleteUser,
};
