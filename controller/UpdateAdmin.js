const { connection } = require("../utils/database");

async function UpdateAdmin(req, res) {
  const Id = req.body.Id;
  const Role = req.body.Role;

  connection.query(`UPDATE Users SET Role = ? WHERE ID = ?`, [Role,Id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Admin Updated' });
    } else {
      res.status(404).json({ message: 'User Not Found' });
    }
  });
}

module.exports = {
  UpdateAdmin,
};
