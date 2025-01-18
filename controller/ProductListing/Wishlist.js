const Wishlist = require('../../models/Wishlist'); // Adjust the path to your Wishlist model

const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if the product is already in the wishlist
        const existingItem = await Wishlist.findOne({ userId, productId });
        if (existingItem) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist' });
        }

        // Add new wishlist item
        const wishlistItem = new Wishlist({ userId, productId });
        await wishlistItem.save();

        res.status(201).json({ success: true, message: 'Product added to wishlist', data: wishlistItem });
    } catch (error) {
        console.error('Error adding to wishlist:', error);

        // Detect specific MongoDB errors
        if (error.name === 'MongoTimeoutError') {
            res.status(500).json({
                success: false,
                message: 'Database connection timed out',
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

const getWishlist = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch wishlist items and populate product details
        const wishlist = await Wishlist.find({ userId })
            .populate({
                path: 'productId',
                select: 'productName price brand discount', // Select desired product fields
                populate: [
                    {
                        path: 'productImages', // Populate images
                        select: 'Image'
                    },
                    {
                        path: 'productTags', // Populate tags
                        select: 'tag'
                    },
                    {
                        path: 'productCategories', // Populate categories
                        select: 'name availableUnits'
                    },
                    {
                        path: 'productAvailability', // Populate availability
                        select: 'accept_Order available_now available_later made_offer allow_customization'
                    }
                ]
            })
            .exec();

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Remove the item from the wishlist
        const result = await Wishlist.findOneAndDelete({ userId, productId });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
        }

        res.status(200).json({ success: true, message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
