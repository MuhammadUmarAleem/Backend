// const express = require('express');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const UserSubscription = require('../../models/UserSubscription');
// const User = require('../../models/User'); // Import the User model

// // Controller function to create a checkout session
// exports.AddUserSubscription = async (req, res) => {
//     const { userId, planId, price } = req.body;

//     if (typeof price !== 'number' || price <= 0) {
//         return res.status(400).json({ message: 'Invalid price value' });
//     }

//     try {
//         // Convert price from dollars to cents
//         const priceInCents = Math.round(price * 100);

//         // Step 1: Create Stripe checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: [{
//                 price_data: {
//                     currency: 'usd',
//                     product_data: { name: `Plan ${planId}` },
//                     unit_amount: priceInCents,
//                 },
//                 quantity: 1,
//             }],
//             mode: 'payment',
//             success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//         });

//         // Step 2: Save the subscription in the database
//         const newSubscription = new UserSubscription({
//             userId,
//             planId,
//             stripeSessionId: session.id,
//             status: 'pending',
//         });
//         await newSubscription.save();

//         // Step 3: Update the User document with the new subscriptionId
//         const user = await User.findById(userId); // Find user by their ID

//         if (user) {
//             user.subscriptionId = session.id; // Save Stripe session ID (or plan ID if you want to save the plan)
//             user.updatedAt = Date.now(); // Set the update timestamp
//             await user.save(); // Save the updated user document
//         }

//         // Step 4: Return the session ID to frontend for redirecting to Stripe Checkout
//         res.status(200).json({ sessionId: session.id });
//     } catch (error) {
//         console.error('Error creating checkout session:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };




const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UserSubscription = require('../../models/UserSubscription');
const User = require('../../models/User');

// Controller function to create a checkout session
exports.AddUserSubscription = async (req, res) => {
    const { userId, planId, price } = req.body;

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'Invalid price value' });
    }

    try {
        // Convert price from dollars to cents
        const priceInCents = Math.round(price * 100);

        // Step 1: Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Plan ${planId}` },
                    unit_amount: priceInCents,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:4000/api/v1/payment-success?session_id={CHECKOUT_SESSION_ID}&userId=${encodeURIComponent(userId)}&planId=${encodeURIComponent(planId)}&price=${encodeURIComponent(price)}`,
            cancel_url: `${process.env.FRONTEND_URL}/buyer/subscription`,
        });

        // Return the session ID to frontend for redirecting to Stripe Checkout
        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to handle payment success
exports.PaymentSuccess = async (req, res) => {
    const { session_id, userId, planId, price } = req.query;

    try {
        // Step 1: Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        // Step 2: Save the subscription in the database
        const newSubscription = new UserSubscription({
            userId: decodeURIComponent(userId),
            planId: decodeURIComponent(planId),
            stripeSessionId: session.id,
            status: 'active',
        });
        await newSubscription.save();

        // Step 3: Update the User document with the new subscriptionId
        const user = await User.findById(decodeURIComponent(userId));
        if (user) {
            user.subscriptionId = session.id;
            user.updatedAt = Date.now(); // Set the update timestamp
            await user.save();
        }

        // Redirect to the frontend success page
        res.redirect(`${process.env.FRONTEND_URL}/buyer/success`);
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


