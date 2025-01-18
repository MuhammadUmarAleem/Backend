const ProductImages = require('../../models/ProductImages'); // Adjust the path as needed

// Add images for a specific product
const AddProductImages = async (req, res) => {
    try {
        const { productId, images } = req.body;

        if (!productId || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: 'Invalid input: productId and images are required.' });
        }

        // Prepare image documents
        const imageDocuments = images.map((url) => ({
            productId,
            Image: url
        }));

        // Save the images to the database
        const savedImages = await ProductImages.insertMany(imageDocuments);

        res.status(201).json({
            message: 'Images added successfully.',
            data: savedImages
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add images.', error: error.message });
    }
};

module.exports = { AddProductImages };
