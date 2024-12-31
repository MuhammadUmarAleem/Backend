const Seller = require('../../models/Seller'); // Assuming the Seller model is in the `models` directory
const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

// Controller to get wallet balance and card details for a seller
const getSellerWallet = async (req, res) => {
    try {
        // Retrieve the seller using the `userId` from the request params or query
        const { userId } = req.params; // Assuming the userId is passed as a parameter

        // Find the seller by userId
        const seller = await Seller.findOne({ userId });

        // Check if seller exists
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Extract necessary details
        const { totalRevenue, walletBalance, cardHolderName, cardNumber, validDate, cvv } = seller;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        

        // Fetch all products of the seller
        const sellerProducts = await Product.find({ userId: userId }).select('_id');
        const sellerProductIds = sellerProducts.map(product => product._id);

        const aggregationPipeline = [
            {
                $match: {
                    'items.productId': { $in: sellerProductIds } // Match orders containing seller's products
                }
            },
            {
                $facet: {
                    last7Days: [
                        {
                            $match: { createdAt: { $gte: sevenDaysAgo, $lt: today } }
                        },
                        {
                            $unwind: '$items'
                        },
                        {
                            $match: { status: 'Completed' }
                        },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                completedOrders: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { "_id": 1 }
                        }
                    ],
                }
            }
        ];

        const [results] = await Order.aggregate(aggregationPipeline);

        const last7DaysData = results.last7Days || [];

        // Create an array of all dates for the last 7 days
        let allDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - (6 - i));
            allDates.push(date.toISOString().split('T')[0]);
        }

        const last7DaysCompletedOrders = allDates.map(date => {
            const found = last7DaysData.find(item => item._id === date);
            return {
                date: date,
                completedOrders: found ? found.completedOrders : 0
            };
        });

        // Return the response with seller details
        return res.status(200).json({
            totalRevenue,
            walletBalance,
            cardDetails: {
                cardHolderName,
                cardNumber,
                validDate,
                cvv
            },
            income: 100,
            expense: 0,
            unknown: 0,
            last7DaysCompletedOrders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getSellerWallet };
