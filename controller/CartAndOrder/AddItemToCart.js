const Cart = require('../../models/Cart');
const ProductCategories = require('../../models/ProductCategories');
const Product = require('../../models/Product');
const Inventory = require('../../models/Inventory');

exports.AddItemToCart = async (req, res) => {
    const {
        buyerId,     // ID of the user adding the item to the cart
        productId,   // ID of the product being added
        categoryId,  // ID of the product category (if applicable)
        quantity     // Number of units being added
    } = req.body;

    try {
        // Step 1: Validate product and category
        const category = await ProductCategories.findOne({
            _id: categoryId,
            productId,
        });

        if (!category) {
            return res.status(404).json({ message: 'Product or category not found' });
        }

        // Step 2: Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Step 3: Check stock availability in the Inventory
        const inventory = await Inventory.findOne({ productId });
        if (!inventory || inventory.stock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock. Only ${inventory ? inventory.stock : 0} units available.`,
            });
        }

        // Step 4: Check category-specific stock availability
        if (quantity > category.availableUnits) {
            return res.status(400).json({
                message: `Only ${category.availableUnits} units available for this category.`,
            });
        }

        // Step 5: Add the item to the user's cart
        const cartItem = {
            productId,
            quantity,
            price: product.price , // Calculate total price
        };

        const cart = await Cart.findOneAndUpdate(
            { buyerId }, // Find cart for the user
            { $push: { items: cartItem } }, // Add the item to the cart's items array
            { new: true, upsert: true } // Create a new cart if it doesn't exist
        );

        // Step 6: Decrement stock in Inventory
        inventory.stock -= quantity;
        inventory.status =
            inventory.stock <= 0
                ? 'out-of-stock'
                : inventory.stock <= inventory.lowStockThreshold
                ? 'low-stock'
                : 'in-stock';
        await inventory.save();

        // Step 7: Decrement category-specific stock
        category.availableUnits -= quantity;
        await category.save();

        res.status(201).json({
            message: 'Item added to cart successfully!',
            cart,
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
