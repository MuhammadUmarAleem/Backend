const Cart = require('../../models/Cart'); // Cart model
const Product = require('../../models/Product'); // Product model
const ProductCategories = require('../../models/ProductCategories'); // ProductCategories model
const ProductImages = require('../../models/ProductImages'); // ProductImages model

exports.GetCart = async (req, res) => {
    const { buyerId } = req.query; // Assuming buyerId is passed as a query parameter

    try {
        // Step 1: Fetch the cart for the given buyer
        const cart = await Cart.findOne({ buyerId });

        if (!cart || !cart.items.length) {
            return res.status(404).json({ message: 'Cart is empty or does not exist' });
        }

        // Step 2: Enhance cart items with product, category, and image details
        const detailedItems = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findById(item.productId);
                const category = await ProductCategories.findOne({ productId: item.productId }); // Find category by productId
                const images = await ProductImages.find({ productId: item.productId }).select('Image -_id');

                return {
                    ...item.toObject(),
                    productDetails: product ? {
                        productName: product.productName,
                        description: product.description,
                        category: product.category,
                        price: product.price,
                        userId: product.userId
                    } : null,
                    productImages: images.map(image => image.Image) // Array of image URLs
                };
            })
        );

        res.status(200).json({
            message: 'Cart details fetched successfully',
            cart: {
                buyerId: cart.buyerId,
                items: detailedItems
            }
        });
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
