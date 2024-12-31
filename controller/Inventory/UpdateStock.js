const Inventory = require('../../models/Inventory'); // Assume a Cart model exists

exports.UpdateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { stock } = req.body;
        const inventory = await Inventory.findOneAndUpdate({ productId }, { stock }, { new: true });
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Product not found in inventory' });
        }
        res.status(200).json({ success: true, message: 'Stock updated successfully', inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update stock', error });
    }
};
