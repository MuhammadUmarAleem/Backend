const mongoose = require('mongoose');
const Payment = require('../../models/Payment'); // Adjust path based on your project structure
const Order = require('../../models/Order'); // Adjust path based on your project structure
const User = require('../../models/User'); // Adjust path based on your project structure
const Product = require('../../models/Product'); // Adjust path based on your project structure

// Function to get payments with filtering
const GetPayments = async (req, res) => {
    try {
        // Extract query parameters
        const { sellerId, filter = 'today' } = req.query; // filter can be 'today', 'weekly', or 'monthly'
        
        // Date logic for filters
        let startDate = new Date();
        if (filter === 'weekly') {
            startDate.setDate(startDate.getDate() - 7); // Get date for the last 7 days
        } else if (filter === 'monthly') {
            startDate.setMonth(startDate.getMonth() - 1); // Get date for the last 30 days
        } else {
            startDate.setHours(0, 0, 0, 0); // Default is today, so reset the time part of the date
        }

        // Build the query object for filtering payments
        const query = {
            createdAt: { $gte: startDate }, // Filter payments created after the startDate
        };

        // If sellerId is provided, filter payments based on orders related to that seller
        if (sellerId) {
            // Find orders associated with this seller
            const orders = await Order.find({ 'items.productId': { $in: await Product.find({ userId: sellerId }).select('_id') } })
                .select('_id'); // Get orders where products belong to the specified seller
            
            if (orders.length === 0) {
                return res.status(200).json({
                    success: true,
                    payments: [], // No payments for this seller
                });
            }

            // Add condition to query for payments related to these orders
            query.orderId = { $in: orders.map(order => order._id) };
        }

        // Fetch the payments with necessary population and filtering
        const payments = await Payment.find(query)
            .populate('buyerId', 'username') // Populate buyer's username
            .populate('orderId', 'createdAt') // Populate order's createdAt date
            .sort({ createdAt: -1 }); // Sort by most recent payments first

        // Respond with the fetched payments
        res.status(200).json({
            success: true,
            payments: payments.map(payment => ({
                paymentId: payment._id,
                buyerName: payment.buyerId.username,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.status,
                transactionId: payment.transactionId,
                orderDate: payment.orderId ? payment.orderId.createdAt : null,
                createdAt: payment.createdAt,
                cardDetails: payment.cardDetails, // Include the card details in the response
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching payments.',
        });
    }
};

module.exports = { GetPayments };
