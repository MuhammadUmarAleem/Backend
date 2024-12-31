const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

exports.GetSellerDashboard = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Validate sellerId
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ success: false, message: 'Invalid seller ID.' });
        }

        // Calculate date ranges for 30 days, 60 days, and the last 7 days
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const sixtyDaysAgo = new Date(thirtyDaysAgo);
        sixtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Fetch all products of the seller
        const sellerProducts = await Product.find({ userId: sellerId }).select('_id');
        const sellerProductIds = sellerProducts.map(product => product._id);

        // Define aggregation pipeline
        const aggregationPipeline = [
            {
                $match: {
                    'items.productId': { $in: sellerProductIds } // Match orders containing seller's products
                }
            },
            {
                $facet: {
                    current: [
                        {
                            $match: { createdAt: { $gte: thirtyDaysAgo, $lt: today } }
                        },
                        {
                            $unwind: '$items'
                        },
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
                                canceledOrders: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
                                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                            }
                        }
                    ],
                    previous: [
                        {
                            $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }
                        },
                        {
                            $unwind: '$items'
                        },
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
                                canceledOrders: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
                                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                            }
                        }
                    ],
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
                    last7DaysCustomers: [
                        {
                            $match: {
                                'items.productId': { $in: sellerProductIds },
                                createdAt: { $gte: sevenDaysAgo, $lte: today }
                            }
                        },
                        {
                            $unwind: '$items'
                        },
                        {
                            $group: {
                                _id: { dayOfWeek: { $dayOfWeek: '$createdAt' }, customerId: '$customerId' },
                                orderCount: { $sum: 1 }
                            }
                        },
                        {
                            $group: {
                                _id: '$_id.dayOfWeek',
                                customerCount: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { _id: 1 } // Sort by day of the week (1 = Sunday, 7 = Saturday)
                        }
                    ],
                    monthWiseRevenue: [
                        {
                            $unwind: '$items'
                        },
                        {
                            $project: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                revenue: { $multiply: ['$items.price', '$items.quantity'] }
                            }
                        },
                        {
                            $group: {
                                _id: { year: '$year', month: '$month' },
                                totalRevenue: { $sum: '$revenue' }
                            }
                        },
                        {
                            $sort: { '_id.year': 1, '_id.month': 1 }
                        }
                    ]
                }
            }
        ];

        const [results] = await Order.aggregate(aggregationPipeline);

        const current = results.current[0] || { totalOrders: 0, completedOrders: 0, canceledOrders: 0, totalRevenue: 0 };
        const previous = results.previous[0] || { totalOrders: 0, completedOrders: 0, canceledOrders: 0, totalRevenue: 0 };
        const last7DaysData = results.last7Days || [];
        const monthWiseRevenue = results.monthWiseRevenue || [];
        const last7DaysCustomersData = results.last7DaysCustomers || [];

        // Get the range of months for the last year
        const startMonth = new Date(today.getFullYear(), today.getMonth() - 11, 1); // Start from 12 months ago
        const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Up to the next month

        const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const last7DaysCustomers = allDays.map((day, index) => {
            const found = last7DaysCustomersData.find(item => item._id === index + 1);
            return {
                day,
                customerCount: found ? found.customerCount : 0
            };
        });

        let allMonths = [];
        for (let date = new Date(startMonth); date < endMonth; date.setMonth(date.getMonth() + 1)) {
            allMonths.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1, // Months are zero-indexed
                monthName: date.toLocaleString('default', { month: 'long' }),
                revenue: 0
            });
        }

        // Merge calculated month-wise revenue with all months
        const formattedMonthWiseRevenue = allMonths.map(month => {
            const found = monthWiseRevenue.find(
                item => item._id.year === month.year && item._id.month === month.month
            );
            return {
                month: month.monthName,
                year: month.year,
                revenue: found ? found.totalRevenue : 0
            };
        });

        const calculateChange = (current, previous) =>
            previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;

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

        const responseData = {
            totalOrders: {
                count: current.totalOrders,
                change: calculateChange(current.totalOrders, previous.totalOrders)
            },
            completedOrders: {
                count: current.completedOrders,
                change: calculateChange(current.completedOrders, previous.completedOrders)
            },
            canceledOrders: {
                count: current.canceledOrders,
                change: calculateChange(current.canceledOrders, previous.canceledOrders)
            },
            totalRevenue: {
                amount: current.totalRevenue,
                change: calculateChange(current.totalRevenue, previous.totalRevenue)
            },
            last7DaysCompletedOrders,
            last7DaysCustomers,
            monthWiseRevenue: formattedMonthWiseRevenue
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the seller dashboard.',
            error: error.message
        });
    }
};
