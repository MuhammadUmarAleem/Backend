const Product = require('../../models/Product');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductCategories = require('../../models/ProductCategories');
const ProductImages = require('../../models/ProductImages');
const ProductTag = require('../../models/ProductTag');

const DuplicateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Fetch the existing product by ID
        const product = await Product.findById(productId)
            .populate('productImages')
            .populate('productTags')
            .populate('productCategories')
            .populate('productAvailability');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Duplicate the product
        const newProductData = { ...product.toObject(), _id: undefined }; // Remove the existing _id
        const newProduct = new Product(newProductData);

        // Save the new product to the database
        await newProduct.save();

        // Duplicate the related data (images, tags, categories, availability)
        const duplicateRelatedData = async () => {
            // Duplicate product images
            for (const image of product.productImages) {
                const newImage = new ProductImages({
                    productId: newProduct._id,
                    Image: image.Image,
                });
                await newImage.save();
            }

            // Duplicate product tags
            for (const tag of product.productTags) {
                const newTag = new ProductTag({
                    productId: newProduct._id,
                    tag: tag.tag,
                });
                await newTag.save();
            }

            // Duplicate product categories
            for (const category of product.productCategories) {
                const newCategory = new ProductCategories({
                    productId: newProduct._id,
                    name: category.name,
                    availableUnits: category.availableUnits,
                });
                await newCategory.save();
            }

            // Duplicate product availability
            const newAvailability = new ProductAvailability({
                productId: newProduct._id,
                accept_Order: product.productAvailability.accept_Order,
                available_now: product.productAvailability.available_now,
                available_later: product.productAvailability.available_later,
                made_offer: product.productAvailability.made_offer,
                allow_customization: product.productAvailability.allow_customization,
            });
            await newAvailability.save();
        };

        // Call the function to duplicate related data
        await duplicateRelatedData();

        // Send response with the new product
        res.status(201).json({ message: 'Product duplicated successfully', product: newProduct });
    } catch (error) {
        console.error('Error duplicating product:', error);
        res.status(500).json({ message: 'Error duplicating product', error });
    }
};

module.exports = {
    DuplicateProduct,
};
