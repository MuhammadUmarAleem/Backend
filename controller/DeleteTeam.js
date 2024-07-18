const { connection } = require("../utils/database");

async function DeleteTeam(req, response) {
  try {
    const teamId = req.query.id;
    connection.query(
      'UPDATE Teams SET Active = 0 WHERE Id = ?',
      [teamId],
      (err, res) => {
        if (err) {
          console.log(err);
          return response.status(500).json({ error: 'Database error' });
        } else {
          return response.status(200).json({ message: 'deleted' });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  DeleteTeam,
};
