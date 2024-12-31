const Notification = require('../../models/Notification'); 

exports.MarkAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await Notification.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'All notifications marked as read', result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error });
    }
};
