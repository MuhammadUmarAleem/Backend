const Order = require('../../models/Order');
const mongoose = require('mongoose');

exports.GetOrders = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { status, timeFilter = 0, currentPage = 1, itemsPerPage = 12 } = req.query;

        // Validate sellerId
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ success: false, message: 'Invalid seller ID.' });
        }

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

        // Pagination settings
        const page = parseInt(currentPage, 10) || 1;
        const limit = parseInt(itemsPerPage, 10) || 12;
        const skip = (page - 1) * limit;

        // Build query object
        const query = { 'items.productId': { $exists: true } };

        if (status) {
            query.status = status;
        }

        // Apply date filter based on timeFilter parameter
        const now = new Date();
        if (timeFilter === '1') {
            // No filter
        } else if (timeFilter === '2') {
            // Current week filter
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            query.createdAt = { $gte: startOfWeek };
        } else if (timeFilter === '3') {
            // Current month filter
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query.createdAt = { $gte: startOfMonth };
        } else {
            // Default: Today's filter
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        // Helper function to calculate total for seller's products
        const calculateTotalForSeller = (items) => {
            return items
                .filter(item => item.productId)
                .reduce((sum, item) => sum + item.price * item.quantity, 0);
        };

        // Fetch orders
        const orders = await Order.find(query)
            .populate({
                path: 'buyerId',
                select: 'username',
            })
            .populate({
                path: 'items.productId',
                match: { userId: sellerObjectId },
                select: 'price',
            })
            .skip(skip)
            .limit(limit);

        const filteredOrders = orders.filter(order =>
            order.items.some(item => item.productId !== null)
        );

        const results = filteredOrders.map(order => {
            const totalAmountForSeller = calculateTotalForSeller(order.items);

            return {
                orderId: order._id,
                createdAt: order.createdAt,
                customerUsername: order.buyerId?.username || 'Unknown',
                totalAmount: totalAmountForSeller,
                status: order.status,
            };
        });

        const totalOrders = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: results,
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalOrders,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching orders.',
            error: error.message,
        });
    }
};
