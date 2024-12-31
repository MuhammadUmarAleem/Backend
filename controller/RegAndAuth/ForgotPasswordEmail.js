const User = require('../../models/User');
const PasswordResetSession = require('../../models/PasswordResetSession');
const { v4: uuidv4 } = require('uuid');
const { transporter } = require('../../utils/nodemailer');

// Forgot password email handler
exports.ForgotPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a UUID for password reset token
        const resetToken = uuidv4();
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

        // Insert a new record into PasswordResetSessions for tracking the reset token
        const resetSession = new PasswordResetSession({
            uuid: resetToken, // A separate UUID for the session if needed
            userId: user._id,
        });
        await resetSession.save();

        // Create a password reset link
        const resetLink = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}`;

        // Send the email with reset link
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h3>Password Reset Request</h3>
                <p>Hello,</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Link</a>
                <p>This link will expire in 1 hour.</p>
            `,
        });

        // Respond with a success message
        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        console.error('Error during forgot password email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
