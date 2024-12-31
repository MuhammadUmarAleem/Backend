const User = require('../../models/User'); // Assuming User model is already created
const EmailVerificationSession = require('../../models/EmailVerificationSession');

exports.VerifyEmail = async (req, res) => {
    const { uuid } = req.params; // Get UUID from URL

    try {
        // Find the email verification session by UUID
        const verificationSession = await EmailVerificationSession.findOne({ uuid });

        if (!verificationSession) {
            return res.status(404).json({ message: 'Invalid or expired verification link' });
        }

        // Find the user associated with the session
        const user = await User.findById(verificationSession.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's Active status to true
        user.active = true;
        await user.save();

        // Optionally: delete the verification session after successful verification
        await EmailVerificationSession.deleteOne({ uuid });

        res.status(200).json({ message: 'Email successfully verified. Your account is now active.' });

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
