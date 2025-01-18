
const User = require('../../models/User');
const EmailVerificationSession = require('../../models/EmailVerificationSession');
const Seller = require('../../models/Seller');
const { transporter } = require('../../utils/nodemailer');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto-js');

exports.RegisterSeller = async (req, res) => {
    const {
        email,
        password,
        profile_Picture,
        businessName,
        province,
        address,
        postalCode,
        country,
        city,
        firstName,
        lastName,
        mobileNumber,
        telephone,
        dateOfBirth,
        website,
        username,
        secretQuestion,
        secretAnswer,
        documentUrl,
        about,
    } = req.body;

    try {
        console.log(email,password,profile_Picture,
            businessName,
            province,
            address,
            postalCode,
            country,
            city,
            firstName,
            lastName,
            mobileNumber,
            telephone,
            dateOfBirth,
            website,
            username,
            secretQuestion,
            secretAnswer,
            documentUrl,
            about)
        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        // if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists' });
        // }

        // Hash the password
        const hashedPassword = crypto.SHA256(password).toString();

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            profile_Picture: profile_Picture || null, // If no profile picture is provided, default to null
            role: 'Seller', // Default role is Buyer
        });

        // Save the user in the database
        await newUser.save();

            const newSeller = new Seller({
                businessName,
                province,
                address,
                postalCode,
                country,
                city,
                firstName,
                lastName,
                mobileNumber,
                telephone: telephone || null,
                dateOfBirth,
                website: website || null,
                secretQuestion,
                secretAnswer,
                documentUrl: documentUrl || null,
                about: about || null,
                userId: newUser._id,
            });

            await newSeller.save();

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
            from: process.env.EMAIL,
            to: newUser.email,
            subject: 'Email Verification',
            html: `<p>Please click on the link below to verify your email:</p>
                   <a href="${verificationLink}">Verify Your Email</a>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
    } catch (error) {
        if (error.code === 11000) {
            console.error('Duplicate key error:', error.keyValue);
            return res.status(400).json({ message: `Duplicate value for field: ${Object.keys(error.keyValue).join(', ')}` });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
    
};
