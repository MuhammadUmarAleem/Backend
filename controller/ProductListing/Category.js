// controllers/categoryController.js

const Category = require('../../models/Category');

// Add new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({ name });
    await newCategory.save(); // Save to the database
    res.status(201).json({
      message: 'Category added successfully',
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add category' });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};
