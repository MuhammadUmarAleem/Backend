const Inventory = require('../../models/Inventory');
const ProductImages = require('../../models/ProductImages');

exports.GetLowStockInventory = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Fetch inventory with low stock for the seller
        const lowStockInventory = await Inventory.find({
            sellerId,
            $expr: {
                $lt: [
                    "$stock",
                    { $ifNull: ["$lowStockThreshold", Infinity] } // Use $ifNull within the $expr operator
                ]
            }
        })
            .populate({
                path: 'productId', // Populate product details
                select: 'productName price description', // Select specific fields
            })
            .lean(); // Convert to plain JS objects for easier manipulation

        // Fetch and attach product images for each low-stock inventory item
        for (const item of lowStockInventory) {
            if (item.productId) {
                const images = await ProductImages.find({ productId: item.productId._id })
                    .select('Image -_id'); // Fetch images without _id field
                item.productImages = images.map((img) => img.Image); // Add images to each inventory item
            }
        }

        res.status(200).json({ success: true, inventory: lowStockInventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch low-stock inventory details', error });
    }
};
