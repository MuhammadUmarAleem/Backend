const Product = require('../../models/Product');
const ProductImages = require('../../models/ProductImages');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductCategories = require('../../models/ProductCategories');
const CategoryDimensions = require('../../models/CategoryDimensions');
const ProductTags = require('../../models/ProductTag'); // Import ProductTags model

// Fetch discounted products where discount is greater than 0, sorted in descending order
exports.GetDiscountedProducts = async (req, res) => {
    const { pageno } = req.params;
    const pageSize = 12; // Number of products per page

    try {
        // Calculate pagination details
        const page = parseInt(pageno, 10) || 1;
        const skip = (page - 1) * pageSize;

        // Fetch discounted products for the seller with pagination
        const discountedProducts = await Product.find({ 
            discount: { $gt: 0 } // Only products with discount greater than 0
        })
            .skip(skip)
            .limit(pageSize)
            .sort({ discount: -1 }) // Sort by discount in descending order
            .lean()  // Converts Mongoose documents to plain JS objects
            .exec();

        // Get product IDs to query related data
        const productIds = discountedProducts.map(product => product._id);

        // Fetch product images
        const productImages = await ProductImages.find({ productId: { $in: productIds } }).lean();
        
        // Fetch product availability
        const productAvailability = await ProductAvailability.find({ productId: { $in: productIds } }).lean();

        // Fetch product tags
        const productTags = await ProductTags.find({ productId: { $in: productIds } }).lean();

        // Combine products with their respective images, availability, and tags
        const productsWithDetails = discountedProducts.map(product => {
            // Get images for the current product
            const images = productImages.filter(img => img.productId.toString() === product._id.toString()).map(img => img.Image);
            
            // Get availability for the current product
            const availability = productAvailability.find(avail => avail.productId.toString() === product._id.toString());
            
            // Get tags for the current product
            const tags = productTags.filter(tag => tag.productId.toString() === product._id.toString()).map(tag => tag.tag);

            return {
                ...product,
                images,
                availability,
                tags // Add tags to the product details
            };
        });

        // Get the total count of discounted products for the seller
        const totalProducts = await Product.countDocuments({ 
            discount: { $gt: 0 } 
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / pageSize);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalProducts,
            products: productsWithDetails
        });
    } catch (error) {
        console.error('Error fetching discounted products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
