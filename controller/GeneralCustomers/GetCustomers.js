const User = require('../../models/User'); // Assuming this is the User model
const Order = require('../../models/Order');
const Product = require('../../models/Product');

exports.GetCustomers = async (req, res) => {
    try {
        const { sellerId } = req.params; // Seller ID is passed as a URL parameter
        const { timeFilter = 0 } = req.query; // Default to today's orders if no timeFilter is provided

        // Step 1: Get all products sold by this seller
        const sellerProducts = await Product.find({ userId: sellerId });

        if (!sellerProducts.length) {
            return res.status(404).json({ message: 'No products found for this seller.' });
        }

        const sellerProductIds = sellerProducts.map(product => product._id);

        // Step 2: Determine date range based on timeFilter
        const now = new Date();
        const query = { 'items.productId': { $in: sellerProductIds } };

        if (timeFilter === '1') {
            // No date filter
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

        // Step 3: Find orders matching the query
        const orders = await Order.find(query).populate(
            'buyerId',
            '_id username email profile_Picture role active'
        );

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this seller.' });
        }

        // Step 4: Aggregate customer data
        const customerData = {};

        orders.forEach(order => {
            if (order.buyerId) { // Check if buyerId is present
                const buyerId = order.buyerId._id.toString();
                const totalAmount = order.totalAmount;
                const orderDate = order.createdAt;

                if (!customerData[buyerId]) {
                    // Initialize customer data if not already present
                    customerData[buyerId] = {
                        customerDetails: {
                            _id: order.buyerId._id,
                            username: order.buyerId.username,
                            email: order.buyerId.email,
                            profile_Picture: order.buyerId.profile_Picture,
                            role: order.buyerId.role,
                            active: order.buyerId.active,
                        },
                        totalSpent: 0,
                        lastOrderAmount: totalAmount,
                        lastOrderDate: orderDate,
                    };
                }

                // Update total amount spent
                customerData[buyerId].totalSpent += totalAmount;

                // Update last order amount and date if this order is more recent
                if (orderDate > customerData[buyerId].lastOrderDate) {
                    customerData[buyerId].lastOrderAmount = totalAmount;
                    customerData[buyerId].lastOrderDate = orderDate;
                }
            }
        });

        // Step 5: Convert customerData to an array
        const result = Object.values(customerData);

        res.status(200).json({
            message: 'Customers retrieved successfully.',
            customers: result,
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'An error occurred while fetching customer data.' });
    }
};
