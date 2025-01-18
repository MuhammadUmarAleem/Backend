const ProductAvailability = require('../../models/ProductAvailability'); // Adjust the path as needed

const UpdateAvailability = async (req, res) => {
  const updateData = req.body; // Extract the fields to update from the request body

  console.log(updateData)

  try {
    // Find and update the ProductAvailability document
    const updatedAvailability = await ProductAvailability.findOneAndUpdate(
      { productId: updateData.availability.productId }, // Find the document by productId
      updateData.availability,    // Update fields provided in the request body
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // If no document is found, return an error
    if (!updatedAvailability) {
      return res.status(404).json({ message: 'Product availability not found' });
    }

    // Return the updated document
    res.status(200).json({
      message: 'Product availability updated successfully',
      data: updatedAvailability
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to update product availability',
      error: error.message
    });
  }
};

module.exports = {
  UpdateAvailability
};
