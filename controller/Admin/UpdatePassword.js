const { connection } = require("../../utils/database");
const crypto = require('crypto'); // For SHA-256 hashing

async function UpdatePassword(req, res) {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "All fields (email, oldPassword, newPassword) are required" });
  }

  try {
    // Encrypt the old password provided by the user
    const oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');

    // Query the user by email and check if the old password matches
    connection.query(
      'SELECT password FROM users WHERE email = ?',
      [email],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database query error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const storedPasswordHash = results[0].password;

        if (storedPasswordHash !== oldPasswordHash) {
          return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Encrypt the new password
        const newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');

        // Update the user's password in the database
        connection.query(
          'UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?',
          [newPasswordHash, email],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({ error: "Failed to update password" });
            }

            return res.status(200).json({ message: "Password updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  UpdatePassword,
};
