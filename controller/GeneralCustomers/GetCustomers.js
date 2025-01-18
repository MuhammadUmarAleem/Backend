const User = require('../../models/User'); // User model
const Order = require('../../models/Order'); // Order model
const Product = require('../../models/Product'); // Product model
const Buyer = require('../../models/Buyer'); // Buyer model

exports.GetCustomers = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { timeFilter = 0 } = req.query;

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
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            query.createdAt = { $gte: startOfWeek };
        } else if (timeFilter === '3') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query.createdAt = { $gte: startOfMonth };
        } else {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        // Step 3: Find orders and populate buyerId
        const orders = await Order.find(query).populate('buyerId');

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this seller.' });
        }

        // Step 4: Aggregate customer data
        const customerData = {};
        for (const order of orders) {
            if (order.buyerId) {
                const buyer = await Buyer.findOne({ userId: order.buyerId._id });
                const userId = order.buyerId._id.toString();
                const totalAmount = order.totalAmount;
                const orderDate = order.createdAt;

                if (!customerData[userId]) {
                    customerData[userId] = {
                        customerDetails: {
                            _id: order.buyerId._id,
                            username: order.buyerId.username,
                            email: order.buyerId.email,
                            profile_Picture: order.buyerId.profile_Picture,
                            role: order.buyerId.role,
                            active: order.buyerId.active,
                            firstName: buyer?.firstName || null,
                            lastName: buyer?.lastName || null,
                            phoneNumber: buyer?.phoneNumber || null,
                            address: buyer?.address || null,
                            jobTitle: buyer?.jobTitle || null,
                            primaryOrganization: buyer?.primaryOrganization || null,
                        },
                        totalSpent: 0,
                        lastOrderAmount: totalAmount,
                        lastOrderDate: orderDate,
                    };
                }

                customerData[userId].totalSpent += totalAmount;

                if (orderDate > customerData[userId].lastOrderDate) {
                    customerData[userId].lastOrderAmount = totalAmount;
                    customerData[userId].lastOrderDate = orderDate;
                }
            }
        }

        // Convert customerData to an array
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
