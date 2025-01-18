const User = require('../../models/User'); // Adjust the path as needed

// Controller to get all users
exports.GetAllUsers = async (req, res) => {
  try {
    // Fetch all users and return only username and _id fields
    const users = await User.find({}, 'username _id');

    if (users.length > 0) {
      return res.status(200).json({ success: true, data: users });
    } else {
      return res.status(404).json({ success: false, message: 'No users found' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
