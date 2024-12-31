const Feedback = require('../../models/Feedback');

exports.AddFeedback = async (req, res) => {
    const { buyerId, sellerId, productId, rating, comment } = req.body;

    try {
        // Validate the rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        // Check if the buyer has already provided feedback for this product and seller
        const existingFeedback = await Feedback.findOne({ buyerId, sellerId, productId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already exists for this product and seller.' });
        }

        // Create new feedback
        const feedback = new Feedback({
            buyerId,
            sellerId,
            productId,
            rating,
            comment
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback added successfully!', feedback });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
