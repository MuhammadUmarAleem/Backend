const mongoose = require('mongoose');
const Product = require('../../models/Product');
const ProductImages = require('../../models/ProductImages');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductCategories = require('../../models/ProductCategories');
const ProductTags = require('../../models/ProductTag');

// Fetch discounted products where discount is greater than 0, sorted in descending order
exports.GetBuyerProducts = async (req, res) => {
    const { pageno } = req.params;
    const { categories, availability } = req.query; // Get categories and availability from query params
    const pageSize = 12; // Number of products per page

    try {
        // Calculate pagination details
        const page = parseInt(pageno, 10) || 1;
        const skip = (page - 1) * pageSize;

        // Build the filter object
        let productFilter = {};

        // Add category-based filtering if categories are provided
        if (categories) {
            const categoryIds = categories.split(','); // Assume categories are passed as comma-separated IDs
            const categoryProducts = await ProductCategories.find({
                name: { $in: categoryIds }
            }).lean();

            const productIdsFromCategories = categoryProducts.map(cat => cat.productId);
            productFilter._id = { $in: productIdsFromCategories };
        }

        // Add availability-based filtering if specified
        if (availability) {
            const isAvailableNow = availability === 'available_now';
            const availabilityFilter = await ProductAvailability.find({
                availableNow: isAvailableNow
            }).lean();

            const productIdsFromAvailability = availabilityFilter.map(avail => avail.productId);
            if (productFilter._id) {
                productFilter._id.$in = productFilter._id.$in.filter(id => productIdsFromAvailability.includes(id.toString()));
            } else {
                productFilter._id = { $in: productIdsFromAvailability };
            }
        }

        // Fetch products for the buyer with pagination and filters
        const products = await Product.find(productFilter)
            .skip(skip)
            .limit(pageSize)
            .lean()
            .exec();

        // Get product IDs to query related data
        const productIds = products.map(product => product._id);

        // Fetch product images
        const productImages = await ProductImages.find({ productId: { $in: productIds } }).lean();

        // Fetch product availability
        const productAvailability = await ProductAvailability.find({ productId: { $in: productIds } }).lean();

        // Fetch product tags
        const productTags = await ProductTags.find({ productId: { $in: productIds } }).lean();

        // Combine products with their respective images, availability, and tags
        const productsWithDetails = products.map(product => {
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

        // Get the total count of products with the current filter
        const totalProducts = await Product.countDocuments(productFilter);

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / pageSize);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalProducts,
            products: productsWithDetails
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
