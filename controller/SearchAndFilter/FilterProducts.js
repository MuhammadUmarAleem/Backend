const Product = require('../../models/Product');
const ProductTag = require('../../models/ProductTag');
const ProductCategories = require('../../models/ProductCategories');
const ProductAvailability = require('../../models/ProductAvailability');
const ProductImages = require('../../models/ProductImages');

// **Query Parameters:**
// - `category` (string): Filter by category name.
// - `price_min` (decimal): Minimum price.
// - `price_max` (decimal): Maximum price.
// - `availability` (string): Acceptable values: `accept_order`, `available_now`, `available_later`.
// - `tags` (string): Comma-separated tags to filter products (e.g., `electronics,wireless`).
// - `page` (int): Pagination page number (default: 1).
// - `limit` (int): Number of products per page (default: 12).

exports.FilterProducts = async (req, res) => {
  const {
    category = '',
    price_min = 0,
    price_max = Number.MAX_SAFE_INTEGER,
    availability = '',
    tags = '',
    page = 1,
    limit = 12
  } = req.query;

  try {
    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Create filter object based on query parameters
    let filter = {};

    // Filter by category if provided
    if (category) {
      const categories = await ProductCategories.find({ name: { $regex: category, $options: 'i' } });
      const categoryProductIds = categories.map(cat => cat.productId);
      filter._id = { $in: categoryProductIds };
    }

    // Filter by price range if provided
    if (price_min || price_max) {
      filter.price = { $gte: parseFloat(price_min), $lte: parseFloat(price_max) };
    }

    // Filter by availability if provided
    if (availability) {
      const availabilityFilter = {};
      if (availability === 'accept_order') {
        availabilityFilter.accept_Order = true;
      } else if (availability === 'available_now') {
        availabilityFilter.available_now = true;
      } else if (availability === 'available_later') {
        availabilityFilter.available_later = true;
      }
      
      const availableProducts = await ProductAvailability.find(availabilityFilter);
      const availableProductIds = availableProducts.map(product => product.productId);
      filter._id = filter._id ? { $in: availableProductIds } : { $in: availableProductIds };
    }

    // Filter by tags if provided
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      const tagProducts = await ProductTag.find({
        tag: { $in: tagList }
      }).select('productId');
      const tagProductIds = tagProducts.map(tag => tag.productId);
      filter._id = filter._id ? { $in: filter._id.$in.concat(tagProductIds) } : { $in: tagProductIds };
    }

    // Find products with the applied filters
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber);

    // Get the total count of filtered products for pagination
    const totalProducts = await Product.countDocuments(filter);

    // Fetch images for each product
    const productImages = await ProductImages.find({
      productId: { $in: products.map(product => product._id) }
    }).select('productId Image');

    // Fetch categories for each product
    const productCategories = await ProductCategories.find({
      productId: { $in: products.map(product => product._id) }
    }).select('productId name');

    // Fetch tags for each product
    const productTags = await ProductTag.find({
      productId: { $in: products.map(product => product._id) }
    }).select('productId tag');

    // Prepare the response with the products and pagination data
    const responseProducts = products.map(product => {
      // Get the images for the current product
      const images = productImages
        .filter(image => image.productId.toString() === product._id.toString())
        .map(image => image.Image);

      // Get the categories for the current product
      const categories = productCategories
        .filter(category => category.productId.toString() === product._id.toString())
        .map(category => category.name);

      // Get the tags for the current product
      const tags = productTags
        .filter(tag => tag.productId.toString() === product._id.toString())
        .map(tag => tag.tag);

      return {
        id: product._id,
        name: product.productName,
        description: product.description,
        price: product.price,
        tags: tags,
        categories: categories,
        rating: product.rating,
        images: images,
        sellerId: product.userId // Assuming the userId is the sellerId
      };
    });

    // Calculate pagination details
    const totalPages = Math.ceil(totalProducts / limitNumber);

    // Return the response
    res.status(200).json({
      products: responseProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts
      }
    });

  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
