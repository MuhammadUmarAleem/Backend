const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const Cart = require('../../models/Cart');
const stripe = require('stripe')('sk_test_51OFsi1IbJoMlvEKENeuoFuDcKJVnaEfgSU5tpbUefLdGGBCYRBcbTMB2pUOBSyUU8uaAWb2rr4g06IoqD2Df5WCX00ySuZfp8h'); // Replace with your Stripe secret key

exports.Order = async (req, res) => {
    const { buyerId } = req.body;

    try {
        // Step 1: Retrieve the cart for the buyer
        const cart = await Cart.findOne({ buyerId });
        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: 'Cart is empty or does not exist' });
        }

        // Step 2: Calculate total amount
        const totalAmount = cart.items.reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );

        // Step 3: Create the order
        const newOrder = new Order({
            buyerId,
            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount,
            status: 'Pending', // Initially set the order status to 'Pending'
        });
        await newOrder.save();

        // Step 4: Record the payment
        const newPayment = new Payment({
            orderId: newOrder._id,
            buyerId,
            amount: totalAmount,
            paymentMethod: 'Stripe',
            status: 'Pending',
        });
        await newPayment.save();

        // Step 5: Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cart.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Product ID: ${item.productId}` },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `http://localhost:4000/api/v1/payment/success?orderId=${newOrder._id}&paymentId=${newPayment._id}&cartId=${cart._id}&sessionId={CHECKOUT_SESSION_ID}&buyerId=${buyerId}`, // Pass session ID
            cancel_url: `https://your-domain.com/payment-cancel`,
            metadata: { orderId: newOrder._id.toString() },
        });

        // Step 6: Update the payment with the session ID
        newPayment.transactionId = session.id;
        await newPayment.save();

        // Step 7: Respond to client with the payment link
        res.status(201).json({
            message: 'Order created and payment link generated successfully',
            order: newOrder,
            paymentLink: session.url, // Stripe Checkout link
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
