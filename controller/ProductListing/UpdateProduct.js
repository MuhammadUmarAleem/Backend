const Product = require('../../models/Product');
const ProductImages = require('../../models/ProductImages');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductTags = require('../../models/ProductTag'); // Import the ProductTags model

// Seller updates a product
exports.UpdateProduct = async (req, res) => {
    const {
        productId,
        productName,
        description,
        price,
        discount,
        brand,
        keyboardLanguage,
        memory,
        storage,
        weight,
        warranty,
        warrantyType,
        taxExcludedPrice,
        taxIncludedPrice,
        taxRule,
        unitPrice,
        minimumOrder,
        acceptOrder,
        availableNow,
        availableLater,
        madeOffer,
        allowCustomization,
        images,
        tags
    } = req.body;

    try {
        // Step 1: Update the product details including price
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                productName,
                description,
                price,
                brand,
                keyboardLanguage,
                memory,
                discount,
                storage,
                weight,
                warranty,
                warrantyType,
                taxExcludedPrice,
                taxIncludedPrice,
                taxRule,
                unitPrice,
                minimumOrder
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Step 2: Update or add product images (if images are provided)
        if (images && images.length > 0) {
            // Delete existing images for the product
            await ProductImages.deleteMany({ productId });

            // Add new images
            const imagePromises = images.map(imageUrl => {
                return new ProductImages({
                    productId: updatedProduct._id,
                    Image: imageUrl // Use the new URL provided by Cloudinary
                }).save();
            });
            await Promise.all(imagePromises);
        }

        // Step 3: Update product availability details
        const updatedAvailability = await ProductAvailability.findOneAndUpdate(
            { productId }, // Find availability by productId
            {
                accept_Order: acceptOrder,
                available_now: availableNow,
                available_later: availableLater,
                made_offer: madeOffer,
                allow_customization: allowCustomization
            },
            { new: true } // Returns the updated availability details
        );

        if (!updatedAvailability) {
            return res.status(404).json({ message: 'Product availability details not found' });
        }

        // Step 4: Update product tags (if tags are provided)
        if (tags && tags.length > 0) {
            // Delete existing tags for the product
            await ProductTags.deleteMany({ productId });

            // Add new tags
            const tagPromises = tags.map(tag => {
                return new ProductTags({
                    productId: updatedProduct._id,
                    tag: tag // The new tag
                }).save();
            });
            await Promise.all(tagPromises);
        }

        // Return updated product, availability, price, and tags
        res.status(200).json({
            message: 'Product updated successfully!',
            product: updatedProduct,
            availability: updatedAvailability,
            price, // Return updated price for confirmation
            images: images, // Return image URLs for confirmation
            tags: tags // Return tags for confirmation
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
