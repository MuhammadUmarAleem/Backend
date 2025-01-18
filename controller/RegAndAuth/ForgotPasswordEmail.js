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
    from: `BoudiBox <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h3 style="color: #444;">Password Reset Request</h3>
            <p>Hello,</p>
            <p>You requested to reset your password. Click the button below to reset your password:</p>
            <p style="text-align: center; margin: 20px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support.</p>
            <p>Thank you,<br>The BoudiBox Team</p>
        </div>
    `,
});


        // Respond with a success message
        res.status(200).json({ message: 'Password reset email sent' });

    } catch (error) {
        console.error('Error during forgot password email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
