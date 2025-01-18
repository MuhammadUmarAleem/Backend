const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Notification = require('../../models/Notification');
const { transporter } = require('../../utils/nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key


exports.PaymentSuccess = async (req, res) => {
    const { orderId, paymentId, sessionId, buyerId } = req.query;

    try {
        if (!sessionId || !orderId || !paymentId || !buyerId) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Step 1: Validate the Stripe session ID
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Invalid or unpaid session' });
        }

        // Step 2: Retrieve the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        // Step 3: Extract card details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        const { brand, last4, exp_month, exp_year } = paymentMethod.card;

        // Update payment status
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        payment.status = 'Success';
        payment.transactionId = sessionId;
        payment.cardDetails = {
            cardHolderName: paymentMethod.billing_details.name || 'N/A',
            cardNumber: `**** **** **** ${last4}`,
            validTill: `${exp_month}/${exp_year}`,
            brand,
        };
        await payment.save();

        // Update order status
        const order = await Order.findById(orderId).populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'Completed';
        order.paymentStatus = 'Paid';
        await order.save();

        const sellerRevenue = {};
        const productNames = [];

        // Collect product names and calculate revenue
        order.items.forEach(item => {
            const { productId, quantity } = item;
            productNames.push(productId.productName); // Collect product name
            const revenue = productId.price * quantity;
            const userId = productId.userId.toString();

            if (!sellerRevenue[userId]) {
                sellerRevenue[userId] = { totalRevenue: 0, walletBalance: 0 };
            }

            sellerRevenue[userId].totalRevenue += revenue;
            sellerRevenue[userId].walletBalance += revenue;
        });

        // Update sellers
        const sellerUpdatePromises = Object.entries(sellerRevenue).map(([userId, { totalRevenue, walletBalance }]) => {
            return Seller.findOneAndUpdate(
                { userId },
                { $inc: { totalRevenue, walletBalance } },
                { new: true }
            ).exec();
        });

        await Promise.all(sellerUpdatePromises);

        // Notifications and Emails
        const notifications = [];
        const emailPromises = [];

        // Buyer notification and email
        const buyer = await User.findById(buyerId).select('email');
        notifications.push(new Notification({
            userId: buyerId,
            message: `Your transaction for the following products was successful: ${productNames.join(', ')}`,
            type: 'Transaction',
        }));
        emailPromises.push(
            transporter.sendMail({
                from: `BoudiBox <${process.env.EMAIL_USER}>`,
                to: buyer.email,
                subject: 'Transaction Successful',
                html: `<p>Dear Buyer,</p>
                       <p>Your transaction for the following products has been successfully processed:</p>
                       <ul>${productNames.map(name => `<li>${name}</li>`).join('')}</ul>
                       <p>Thank you for shopping with us!</p>`,
            })
        );

        // Seller notifications and emails
        const sellerUsers = await User.find({ _id: { $in: Object.keys(sellerRevenue) } }).select('email');
        sellerUsers.forEach(seller => {
            notifications.push(new Notification({
                userId: seller._id,
                message: `You have sold one or more products: ${productNames.join(', ')}`,
                type: 'Transaction',
            }));
            emailPromises.push(
                transporter.sendMail({
                    from: `BoudiBox <${process.env.EMAIL_USER}>`,
                    to: seller.email,
                    subject: 'Product Sold Notification',
                    html: `<p>Dear Seller,</p>
                           <p>One or more of your products have been sold:</p>
                           <ul>${productNames.map(name => `<li>${name}</li>`).join('')}</ul>
                           <p>Congratulations on your sale!</p>`,
                })
            );
        });

        // Save notifications and send emails
        await Notification.insertMany(notifications);
        await Promise.all(emailPromises);

        // Remove purchased items from cart
        await Cart.updateOne(
            { buyerId },
            { $pull: { items: { productId: { $in: order.items.map(item => item.productId._id) } } } }
        );

        res.redirect(`${process.env.FRONTEND_URL}/buyer/success`);
    } catch (error) {
        console.error('Error updating statuses:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
