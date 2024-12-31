const Inventory = require('../../models/Inventory');
const ProductImages = require('../../models/ProductImages');

exports.GetInventory = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Fetch inventory with product details and images
        const inventory = await Inventory.find({ sellerId })
            .populate({
                path: 'productId', // Populate product details
                select: 'productName price description', // Select specific fields
            })
            .lean(); // Convert to plain JS objects for easier manipulation

        // Fetch and attach product images for each inventory item
        for (const item of inventory) {
            if (item.productId) {
                const images = await ProductImages.find({ productId: item.productId._id })
                    .select('Image -_id'); // Fetch images without _id field
                item.productImages = images.map((img) => img.Image); // Add images to each inventory item
            }
        }

        res.status(200).json({ success: true, inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch inventory details', error });
    }
};
