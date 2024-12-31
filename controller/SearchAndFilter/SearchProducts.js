const Product = require('../../models/Product');
const ProductTag = require('../../models/ProductTag');
const ProductImages = require('../../models/ProductImages');
const ProductCategories = require('../../models/ProductCategories');

// **Query Parameters:**
// - `q` (string): Keyword to search in product name, description, or tags.
// - `page` (int): Pagination page number (default: 1).
// - `limit` (int): Number of products per page (default: 12).


exports.SearchProducts = async (req, res) => {
  const { q = '', page = 1, limit = 12 } = req.query; // Destructure with default values

  try {
    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the offset for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Search product tags and categories first to get relevant product IDs
    const tagSearch = await ProductTag.find({
      tag: { $regex: q, $options: 'i' }
    }).select('productId tag');
    
    const categorySearch = await ProductCategories.find({
      name: { $regex: q, $options: 'i' }
    }).select('productId name');

    // Get product IDs from the search results (tags and categories)
    const tagProductIds = tagSearch.map(tag => tag.productId);
    const categoryProductIds = categorySearch.map(category => category.productId);

    // Combine product IDs from tags and categories
    const searchProductIds = [...new Set([...tagProductIds, ...categoryProductIds])];

    // Search products by name, description, or the product IDs obtained from tags/categories
    const products = await Product.find({
      $or: [
        { productName: { $regex: q, $options: 'i' } },  // Case-insensitive match for product name
        { description: { $regex: q, $options: 'i' } },  // Case-insensitive match for product description
        { _id: { $in: searchProductIds } }               // Match by product IDs from tags/categories
      ]
    })
    .skip(skip)   // Skip products for pagination
    .limit(limitNumber); // Limit the number of products

    // Get the total count of products for pagination purposes
    const totalProducts = await Product.countDocuments({
      $or: [
        { productName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { _id: { $in: searchProductIds } }
      ]
    });

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

    // Calculate pagination details
    const totalPages = Math.ceil(totalProducts / limitNumber);

    // Prepare the response
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
        tags: tags, // Return tags separately
        categories: categories, // Return categories separately
        rating: product.rating, // Assuming the product model includes a rating field
        images: images,
        sellerId: product.userId // Assuming the userId is the sellerId
      };
    });

    // Return the results with pagination
    res.status(200).json({
      products: responseProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
