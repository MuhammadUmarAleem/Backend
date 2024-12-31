const ProductCategories = require('../../models/ProductCategories');
const CategoryDimensions = require('../../models/CategoryDimensions');

// Fetch all categories with dimensions
exports.GetCategories = async (req, res) => {
    try {
        // Fetch all product categories
        const categories = await ProductCategories.find({}, 'name _id'); // Fetch only name and _id

        // Fetch dimensions for each category
        const categoriesWithDimensions = await Promise.all(
            categories.map(async (category) => {
                const dimensions = await CategoryDimensions.findOne(
                    { categoryId: category._id }, 
                    'length width height' // Fetch only length, width, and height
                );
                return {
                    name: category.name,
                    id: category._id,
                    dimensions
                };
            })
        );

        res.status(200).json({
            message: 'Categories retrieved successfully!',
            categories: categoriesWithDimensions
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
