const crypto = require('crypto');
const PasswordResetSession = require('../../models/PasswordResetSession');
const User = require('../../models/User');

exports.PasswordResetSession = async (req, res) => {
    const { uuid, newPassword } = req.body;

    try {
        // Check if the reset session exists and is still valid
        const resetSession = await PasswordResetSession.findOne({ uuid: uuid });

        if (!resetSession) {
            return res.status(404).json({ message: 'Invalid or expired password reset token' });
        }

        // Find the associated user
        const user = await User.findOne({ _id: resetSession.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Remove the reset session after successful password reset
        await PasswordResetSession.deleteOne({ uuid: uuid });

        // Respond with success
        res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
