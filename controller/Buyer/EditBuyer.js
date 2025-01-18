const Buyer = require('../../models/Buyer'); // Import the Buyer model

exports.EditBuyer = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const buyer = await Buyer.findOneAndUpdate({ userId }, updates, { new: true });
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        res.status(200).json({ message: 'Buyer updated successfully', data: buyer });
    } catch (error) {
        console.error('Error updating buyer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};