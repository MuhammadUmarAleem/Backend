// controllers/brandController.js

const Brand = require('../../models/Brand');

// Add new brand
exports.addBrand = async (req, res) => {
  const { name } = req.body;

  try {
    const newBrand = new Brand({ name });
    await newBrand.save(); // Save to the database
    res.status(201).json({
      message: 'Brand added successfully',
      brand: newBrand,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add brand' });
  }
};

// Get all brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find(); // Fetch all brands
    res.status(200).json({ brands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch brands' });
  }
};
