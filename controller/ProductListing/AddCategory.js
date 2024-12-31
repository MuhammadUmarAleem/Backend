const ProductCategories = require('../../models/ProductCategories');
const CategoryDimensions = require('../../models/CategoryDimensions');

// Seller adds a category
exports.AddCategory = async (req, res) => {
    const {
        productId,
        name,
        availableUnits,
        length,
        width,
        height
    } = req.body;

    try {
        // Step 1: Create the product category
        const newCategory = new ProductCategories({
            productId,
            name,
            availableUnits
        });
        await newCategory.save();

        // Step 2: Add dimensions for the category (if dimensions are provided)
        const newCategoryDimensions = new CategoryDimensions({
            categoryId: newCategory._id, // Use the newly created category's ID
            length,
            width,
            height
        });
        await newCategoryDimensions.save();

        res.status(201).json({
            message: 'Category added successfully!',
            category: newCategory,
            dimensions: newCategoryDimensions
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
