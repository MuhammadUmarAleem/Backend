const { connection } = require("../utils/database");

async function UpdateTeam(req, response) {
  const { Title, Id, LeadId } = req.body;

  const query = `
    UPDATE Teams
    SET Title = ?, LeadId = ?
    WHERE Id = ?;
  `;

  try {
    // Check if another team with the same title exists (excluding the current team Id)
    connection.query(`SELECT * FROM Teams WHERE Title = ? AND Id != ?`, [Title, Id], (err, res) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Internal Server Error" });
      } else {
        if (res.length === 0) {
          // Update the team title
          connection.query(query, [Title,LeadId, Id], (err, res) => {
            if (err) {
              console.error(err);
              return response.status(500).json({ error: "Internal Server Error" });
            } else {
              return response.status(200).json({ message: "updated" });
            }
          });
        } else {
          // Team with the same title already exists
          return response.status(200).json({ message: "already" });
        }
      }
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  UpdateTeam,
};
