const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51OFsi1IbJoMlvEKENeuoFuDcKJVnaEfgSU5tpbUefLdGGBCYRBcbTMB2pUOBSyUU8uaAWb2rr4g06IoqD2Df5WCX00ySuZfp8h'); // Replace with your Stripe secret key
const Order = require('../../models/Order');
const Payment = require('../../models/Payment');

const RefundProductInOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.body;

        if (!orderId || !productId) {
            return res.status(400).json({ error: 'Order ID and Product ID are required.' });
        }

        // Fetch the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Find the product in the order
        const product = order.items.find(item => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found in the order.' });
        }

        if (product.refund) {
            return res.status(400).json({ error: 'Refund has already been processed for this product.' });
        }

        const refundAmount = product.quantity * product.price;

        // Fetch the payment associated with the order
        const payment = await Payment.findOne({ orderId });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found for this order.' });
        }

        if (!payment.transactionId) {
            return res.status(400).json({ error: 'Transaction ID not available for the payment.' });
        }

        const session = await stripe.checkout.sessions.retrieve(payment.transactionId);
        const paymentIntentId = session.payment_intent;

        console.log('Transaction ID:', payment.transactionId);
        console.log('paymentIntentId:', paymentIntentId);

        // Attempt to process the refund
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(refundAmount * 100), // Stripe expects the amount in cents
        });

        // Update the order with the refunded status
        order.items = order.items.map(item =>
            item.productId.toString() === productId
                ? { ...item, refund: true }
                : item
        );

        order.totalAmount = Math.max(order.totalAmount - refundAmount, 0); // Ensure total amount doesn't go below zero
        await order.save();

        console.log('Refund processed:', refund);

        return res.status(200).json({
            message: 'Refund processed successfully.',
            refund,
        });
    } catch (error) {
        console.error('Error processing refund:', error);

        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({ error: error.raw?.message || 'Invalid request to Stripe.' });
        }

        return res.status(500).json({ error: 'An error occurred while processing the refund.' });
    }
};

module.exports = { RefundProductInOrder };
