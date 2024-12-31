const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Notification = require('../../models/Notification');
const { transporter } = require('../../utils/nodemailer');
const stripe = require('stripe')('sk_test_51OFsi1IbJoMlvEKENeuoFuDcKJVnaEfgSU5tpbUefLdGGBCYRBcbTMB2pUOBSyUU8uaAWb2rr4g06IoqD2Df5WCX00ySuZfp8h'); // Replace with your Stripe secret key

exports.PaymentSuccess = async (req, res) => {
    const { orderId, paymentId, cartId, sessionId, buyerId} = req.query;

    try {
        // Step 1: Validate the Stripe session ID
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Invalid or unpaid session' });
        }

        // Step 2: Retrieve the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        // Step 3: Extract card details (non-sensitive information only)
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        const { brand, last4, exp_month, exp_year } = paymentMethod.card;

        // Step 2: Update payment status
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        payment.status = 'Success';
        payment.transactionId = sessionId;
        payment.cardDetails = {
            cardHolderName: paymentMethod.billing_details.name || 'N/A',
            cardNumber: `**** **** **** ${last4}`, // Masked card number (secure storage)
            validTill: `${exp_month}/${exp_year}`,
            brand, // Card brand (e.g., Visa, MasterCard)
        };
        await payment.save();

        // Step 3: Update order status
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'Completed';
        order.paymentStatus = 'Paid';
        await order.save();

        // Step 4: Get product IDs from the cart
        const cart = await Cart.findById(cartId).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Step 5: Calculate revenue and update sellers
        const sellerRevenue = {};

        cart.items.forEach(item => {
            const { productId, quantity } = item;
            const revenue = productId.price * quantity;
            const userId = productId.userId.toString();

            if (!sellerRevenue[userId]) {
                sellerRevenue[userId] = { totalRevenue: 0, walletBalance: 0 };
            }

            sellerRevenue[userId].totalRevenue += revenue;
            sellerRevenue[userId].walletBalance += revenue;
        });

        console.log(sellerRevenue)

        const sellerUpdatePromises = Object.entries(sellerRevenue).map(([userId, { totalRevenue, walletBalance }]) => {
            return Seller.findOneAndUpdate(
                { userId: userId }, // Compare by userId
                {
                    $inc: { // Increment the fields
                        totalRevenue,
                        walletBalance,
                    },
                },
                { new: true }
            ).exec(); // Ensure the query is executed
        });
        
        
        await Promise.all(sellerUpdatePromises);

        console.log(sellerUpdatePromises)


        // Step 6: Notifications and Emails
        const notifications = [];
        const emailPromises = [];

        // Notification and Email to Buyer
        const buyer = await User.findById(buyerId).select('email');
        notifications.push(new Notification({
            userId: buyerId,
            message: `Your transaction for order ${orderId} was successful.`,
            type: 'Transaction',
        }));
        emailPromises.push(
            transporter.sendMail({
                from: process.env.EMAIL,
                to: buyer.email,
                subject: 'Transaction Successful',
                html: `<p>Dear Buyer,</p>
                       <p>Your transaction for order <strong>${orderId}</strong> has been successfully processed.</p>
                       <p>Thank you for shopping with us!</p>`,
            })
        );

        // Notifications and Emails to Sellers
        const sellerUsers = await User.find({ _id: { $in: Object.keys(sellerRevenue) } }).select('email');
        sellerUsers.forEach(seller => {
            notifications.push(new Notification({
                userId: seller._id,
                message: `You have sold a product in order ${orderId}.`,
                type: 'Transaction',
            }));

            emailPromises.push(
                transporter.sendMail({
                    from: process.env.EMAIL,
                    to: seller.email,
                    subject: 'Product Sold Notification',
                    html: `<p>Dear Seller,</p>
                           <p>One or more of your products have been sold in order <strong>${orderId}</strong>.</p>
                           <p>Congratulations on your sale!</p>`,
                })
            );
        });

        // Save all notifications
        await Notification.insertMany(notifications);

        // Send all emails
        await Promise.all(emailPromises);

        // Step 7: Delete the cart
        await Cart.findByIdAndDelete(cartId);

        res.status(200).json({
            message: 'Order and payment statuses updated successfully, sellers updated, notifications and emails sent, and cart deleted',
            order,
            payment,
        });
    } catch (error) {
        console.error('Error updating statuses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
