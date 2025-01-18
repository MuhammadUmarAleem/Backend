const User = require('../../models/User'); // Assuming User model is already created
const Buyer = require('../../models/Buyer'); // Import the Buyer model
const EmailVerificationSession = require('../../models/EmailVerificationSession');
const { transporter } = require('../../utils/nodemailer');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto-js');

// Function to register a new user and send a verification email
exports.Register = async (req, res) => {
    const { email, password, profile_Picture, role, username, firstName, lastName } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = crypto.SHA256(password).toString();

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            profile_Picture: profile_Picture || null, // Default to null if no profile picture provided
            role: role || 'Buyer', // Default role is Buyer
        });

        // Save the user in the database
        await newUser.save();

        // Save the buyer with userId, firstName, and lastName
        const newBuyer = new Buyer({
            userId: newUser._id,
            firstName: firstName || null, // Default to null if not provided
            lastName: lastName || null,  // Default to null if not provided
        });
        await newBuyer.save();

        // Generate a UUID token for email verification
        const uuidToken = uuidv4();

        // Create a new email verification session
        const emailVerificationSession = new EmailVerificationSession({
            uuid: uuidToken,
            userId: newUser._id,
        });
        await emailVerificationSession.save();

        // Prepare the email verification link
        const verificationLink = `http://localhost:4000/api/v1/verifyEmail/${uuidToken}`;

        // Email content
        const mailOptions = {
            from: `BoudiBox <${process.env.EMAIL_USER}>`,
            to: newUser.email,
            subject: 'Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #444;">Welcome to BoudiBox!</h2>
                    <p>
                        Please verify your email to complete your registration and start exploring the best deals on our platform. Click the link below to verify your account:
                    </p>
                    <p>
                        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
                    </p>
                    <p>Thank you for joining BoudiBox!</p>
                    <p>Best regards,<br>The BoudiBox Team</p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
