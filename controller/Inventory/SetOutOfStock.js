const Inventory = require('../../models/Inventory'); // Assume a Cart model exists

exports.SetOutOfStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const inventory = await Inventory.findOneAndUpdate({ productId }, { status: 'out-of-stock', stock: 0 }, { new: true });
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Product not found in inventory' });
        }
        res.status(200).json({ success: true, message: 'Product marked as out of stock', inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark as out of stock', error });
    }
};
