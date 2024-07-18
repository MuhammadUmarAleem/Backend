const { connection } = require("../utils/database");

async function AddAdmin(req, res) {
  const Id = req.body.id;

  connection.query(`UPDATE Users SET Role = 'Admin' WHERE ID = ?`, [Id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Admin Added' });
    } else {
      res.status(404).json({ message: 'User Not Found' });
    }
  });
}

module.exports = {
  AddAdmin,
};
