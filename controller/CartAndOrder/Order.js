const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.Order = async (req, res) => {
    const { buyerId, products, buyerDetail } = req.body; // products: [{ productId, quantity }], buyerDetail: { firstname, companyName, address, apartment, city, phoneNumber, email }

    try {
        // Step 1: Fetch product details
        const productDetails = await Product.find({
            _id: { $in: products.map(p => p.productId) }
        });

        if (productDetails.length !== products.length) {
            return res.status(400).json({ message: 'Some products were not found' });
        }

        // Step 2: Calculate total amount
        const totalAmount = products.reduce((total, product) => {
            const productDetail = productDetails.find(p => p._id.equals(product.productId));
            return total + product.quantity * productDetail.price;
        }, 0);

        // Step 3: Create the order with buyer detail
        const newOrder = new Order({
            buyerId,
            buyerDetail, // Add buyer details
            items: products.map(product => {
                const productDetail = productDetails.find(p => p._id.equals(product.productId));
                return {
                    productId: product.productId,
                    quantity: product.quantity,
                    price: productDetail.price,
                };
            }),
            totalAmount,
            status: 'Pending',
        });
        await newOrder.save();

        // Step 4: Create the payment record
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
            line_items: products.map(product => {
                const productDetail = productDetails.find(p => p._id.equals(product.productId));
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `Product: ${productDetail.productName}` },
                        unit_amount: productDetail.price * 100,
                    },
                    quantity: product.quantity,
                };
            }),
            mode: 'payment',
            success_url: `http://localhost:4000/api/v1/payment/success?orderId=${newOrder._id}&paymentId=${newPayment._id}&sessionId={CHECKOUT_SESSION_ID}&buyerId=${buyerId}`,
            cancel_url: `${process.env.FRONTEND_URL}/buyer/cart`,
            metadata: { orderId: newOrder._id.toString() },
        });

        newPayment.transactionId = session.id;
        await newPayment.save();

        res.status(201).json({
            message: 'Order created and payment link generated successfully',
            order: newOrder,
            paymentLink: session.url,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
