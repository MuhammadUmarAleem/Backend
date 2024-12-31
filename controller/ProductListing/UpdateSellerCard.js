const Seller = require('../../models/Seller'); // Assuming the Seller model is in the `models` directory

// Controller to update seller's card details
const UpdateSellerCard = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        const { cardHolderName, cardNumber, validDate, cvv } = req.body; // Get card details from request body

        // Find the seller by userId
        const seller = await Seller.findOne({ userId });

        // Check if the seller exists
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Update the seller's card details
        seller.cardHolderName = cardHolderName || seller.cardHolderName;
        seller.cardNumber = cardNumber || seller.cardNumber;
        seller.validDate = validDate || seller.validDate;
        seller.cvv = cvv || seller.cvv;

        // Save the updated seller document
        await seller.save();

        return res.status(200).json({ message: 'Card details updated successfully', seller });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { UpdateSellerCard };
