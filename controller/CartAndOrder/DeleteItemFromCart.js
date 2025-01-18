const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

exports.DeleteItemFromCart = async (req, res) => {
    const { buyerId, productId } = req.body; // ID of the user and product to remove

    try {
        // Find the cart
        const cart = await Cart.findOne({ buyerId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Retrieve the quantity to restore stock
        const { quantity } = cart.items[itemIndex];

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        // Restore stock in the Product table
        const product = await Product.findById(productId);
        if (product) {
            product.stock += quantity;
            await product.save();
        }

        res.status(200).json({
            message: 'Item removed from cart successfully!',
            cart,
        });
    } catch (error) {
        console.error('Error deleting item from cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
