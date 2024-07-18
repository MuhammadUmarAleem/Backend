const { connection } = require("../utils/database");

async function CompletionRequest(req, res) {
  const Id = req.body.Id;

  connection.query(`UPDATE Tickets SET Status = ? WHERE Id = ?`, ["Completion Requested",Id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Ticket Updated' });
    } else {
      res.status(404).json({ message: 'Ticket Not Found' });
    }
  });
}

module.exports = {
    CompletionRequest,
};
