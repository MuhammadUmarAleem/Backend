const Order = require('../../models/Order');
const mongoose = require('mongoose');
const Buyer = require('../../models/Buyer');  // Import the Buyer model

exports.GetOrderDetails = async (req, res) => {
    try {
        const { sellerId, orderId } = req.params; // Extract sellerId and orderId from params

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ success: false, message: 'Invalid seller ID.' });
        }
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID.' });
        }

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        const orderObjectId = new mongoose.Types.ObjectId(orderId);

        // Fetch the order
        const order = await Order.findOne({ _id: orderObjectId })
            .populate({
                path: 'buyerId',
                select: 'username email', // Select relevant buyer details
            })
            .populate({
                path: 'items.productId',
                match: { userId: sellerObjectId }, // Ensure products belong to the seller
                select: 'productName price description', // Select relevant product details
            });

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Fetch additional details from the Buyer model
        const buyerDetails = await Buyer.findOne({ userId: order.buyerId._id })
            .select('firstName lastName address'); // Fetch first name, last name, and address

        // Filter products belonging to the seller
        const sellerProducts = order.items.filter(item => item.productId);

        // Format the response
        const result = {
            orderId: order._id,
            createdAt: order.createdAt,
            buyerDetails: {
                username: order.buyerId?.username || 'Unknown',
                email: order.buyerId?.email || 'Unknown',
                firstName: buyerDetails?.firstName || 'Unknown',
                lastName: buyerDetails?.lastName || 'Unknown',
                address: buyerDetails?.address || 'Unknown',
            },
            products: sellerProducts.map(item => ({
                productId: item.productId._id,
                productName: item.productId.productName,
                description: item.productId.description,
                price: item.productId.price,
                quantity: item.quantity,
                total: item.productId.price * item.quantity,
            })),
            totalAmount: sellerProducts.reduce(
                (sum, item) => sum + item.productId.price * item.quantity,
                0
            ),
            status: order.status,
        };

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching order details.',
            error: error.message,
        });
    }
};
