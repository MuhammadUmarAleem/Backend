const { Users } = require("../../models/Users");

async function UpdateAdmin(req, res) {
  const { Id, Role } = req.body;

  try {
    const user = await Users.findOne({ where: { ID: Id } });

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    await user.update({ Role });

    res.status(200).json({ message: 'Admin Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
}

module.exports = {
  UpdateAdmin,
};
