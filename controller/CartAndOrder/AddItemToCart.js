const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

exports.AddItemToCart = async (req, res) => {
    const {
        buyerId,     // ID of the user adding the item to the cart
        productId,   // ID of the product being added
        quantity     // Number of units being added
    } = req.body;

    try {
        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock availability in the Product table
        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock. Only ${product.stock} units available.`,
            });
        }

        // Check if the cart already exists for the buyer
        const cart = await Cart.findOne({ buyerId });

        if (cart) {
            // Check if the product already exists in the cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                // Return a message indicating the product is already in the cart
                return res.status(400).json({
                    message: 'This product is already in the cart.',
                });
            } else {
                // Add a new item if the product is not already in the cart
                cart.items.push({
                    productId,
                    quantity,
                    price: product.price,
                });
                await cart.save();
            }
        } else {
            // Create a new cart if it doesn't exist
            const newCart = new Cart({
                buyerId,
                items: [
                    {
                        productId,
                        quantity,
                        price: product.price,
                    },
                ],
            });
            await newCart.save();
        }

        // Decrement stock in the Product table
        product.stock -= quantity;
        await product.save();

        res.status(201).json({
            message: 'Item added to cart successfully!',
            cart: await Cart.findOne({ buyerId }), // Return the updated cart
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
