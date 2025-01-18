const Feedback = require('../../models/Feedback');
const Buyer = require('../../models/Buyer');
const Seller = require('../../models/Seller');

exports.GetProductFeedback = async (req, res) => {
    const { productId } = req.params;

    try {
        // Retrieve feedbacks for the given product
        const feedbacks = await Feedback.find({ productId }).populate('productId', 'productName description price');

        // Fetch buyer and seller details for each feedback
        const formattedFeedbacks = await Promise.all(
            feedbacks.map(async feedback => {
                const buyer = await Buyer.findOne({ userId: feedback.buyerId }, 'firstName lastName email');
                const seller = await Seller.findOne({ userId: feedback.sellerId }, 'firstName lastName email businessName');

                return {
                    ...feedback._doc, // Spread the original feedback document
                    buyerName: buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() : 'N/A',
                    sellerName: seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'N/A',
                    businessName: seller?.businessName || 'N/A'
                };
            })
        );

        res.status(200).json({
            message: 'Feedback retrieved successfully!',
            feedbacks: formattedFeedbacks
        });
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
