const Inventory = require('../../models/Inventory'); // Assume a Cart model exists

exports.AddInventory = async (req, res) => {
    try {
        const { productId, stock, lowStockThreshold, reorderLevel, sellerId } = req.body;
        const inventory = await Inventory.create({ productId, stock, lowStockThreshold, reorderLevel, sellerId: sellerId });
        res.status(201).json({ success: true, message: 'Inventory added successfully', inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add inventory', error });
    }
};
