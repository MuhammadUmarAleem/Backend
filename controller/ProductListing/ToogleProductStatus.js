const Product = require('../../models/Product'); // Adjust the path as necessary

// Toggle Product Status (Activate/Inactivate)
const ToggleProductStatus = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Toggle the status value
        product.status = !product.status;

        // Save the updated product
        await product.save();

        res.status(200).json({ success: true, message: `Product ${product.status ? 'activated' : 'inactivated'}`, data: product });
    } catch (error) {
        console.error('Error toggling product status:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { ToggleProductStatus };
