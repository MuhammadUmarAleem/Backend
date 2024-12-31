const Product = require('../../models/Product');
const ProductImages = require('../../models/ProductImages');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductCategories = require('../../models/ProductCategories');
const CategoryDimensions = require('../../models/CategoryDimensions');
const ProductTags = require('../../models/ProductTag'); // Import ProductTags model

// Fetch seller's products with images, availability, and tags, paginated
exports.GetProducts = async (req, res) => {
    const { sellerid, pageno } = req.params;
    const pageSize = 12; // Number of products per page

    try {
        // Calculate pagination details
        const page = parseInt(pageno, 10) || 1;
        const skip = (page - 1) * pageSize;

        // Fetch products for the seller with pagination
        const products = await Product.find({ userId: sellerid })
            .skip(skip)
            .limit(pageSize)
            .lean()  // Converts Mongoose documents to plain JS objects
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

        // Get the total count of products for the seller
        const totalProducts = await Product.countDocuments({ userId: sellerid });

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


// Fetch a single product with its details, availability, images, categories, dimensions, and tags
exports.GetProduct = async (req, res) => {
    const { sellerid, productId } = req.params;

    try {
        // Fetch product details
        const product = await Product.findOne({ _id: productId, userId: sellerid }).populate('userId');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch product availability
        const availability = await ProductAvailability.findOne({ productId });

        // Fetch product images
        const images = await ProductImages.find({ productId });

        // Fetch product categories
        const categories = await ProductCategories.find({ productId });

        // Fetch category dimensions for each category
        const categoryDimensions = await Promise.all(
            categories.map(category =>
                CategoryDimensions.find({ categoryId: category._id })
            )
        );

        // Fetch product tags
        const tags = await ProductTags.find({ productId }).lean(); // Fetch product tags

        // Prepare the response data
        const responseData = {
            product,
            availability,
            images,
            categories: categories.map((category, index) => ({
                ...category.toObject(),
                dimensions: categoryDimensions[index]
            })),
            tags: tags.map(tag => tag.tag) // Include the tags in the response
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.GetBuyerProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        // Fetch product details
        const product = await Product.findOne({ _id: productId }).populate('userId');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch product availability
        const availability = await ProductAvailability.findOne({ productId });

        // Fetch product images
        const images = await ProductImages.find({ productId });

        // Fetch product categories
        const categories = await ProductCategories.find({ productId });

        // Fetch category dimensions for each category
        const categoryDimensions = await Promise.all(
            categories.map(category =>
                CategoryDimensions.find({ categoryId: category._id })
            )
        );

        // Fetch product tags
        const tags = await ProductTags.find({ productId }).lean(); // Fetch product tags

        // Prepare the response data
        const responseData = {
            product,
            availability,
            images,
            categories: categories.map((category, index) => ({
                ...category.toObject(),
                dimensions: categoryDimensions[index]
            })),
            tags: tags.map(tag => tag.tag) // Include the tags in the response
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Delete a product along with its related records (images, availability, categories, tags, etc.)
exports.DeleteProduct = async (req, res) => {
    const { sellerid, productId } = req.params;

    try {
        // Find the product by ID and ensure it belongs to the seller
        const product = await Product.findOne({ _id: productId, userId: sellerid });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or does not belong to the seller' });
        }

        // Delete related records in other collections
        // First, get all categories related to the product
        const productCategories = await ProductCategories.find({ productId });

        // Get the category IDs to delete from CategoryDimensions
        const categoryIds = productCategories.map(category => category._id);

        // Delete product tags
        await ProductTags.deleteMany({ productId }); // Delete the tags related to this product

        // Now delete from the related collections
        await ProductImages.deleteMany({ productId });
        await ProductAvailability.deleteMany({ productId });
        await ProductCategories.deleteMany({ productId });
        
        // Delete CategoryDimensions where categoryId is in the list of categoryIds
        await CategoryDimensions.deleteMany({ categoryId: { $in: categoryIds } });

        // Delete the product
        await Product.deleteOne({ _id: productId });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) { 
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
