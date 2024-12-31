const Cart = require('../../models/Cart');
const ProductCategories = require('../../models/ProductCategories');
const Inventory = require('../../models/Inventory');

exports.DeleteItemFromCart = async (req, res) => {
    const {
        buyerId,     // ID of the user
        productId,   // ID of the product being removed
        categoryId   // ID of the product category
    } = req.body;

    try {
        // Step 1: Validate the cart item
        const cart = await Cart.findOne({ buyerId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }

        const cartItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the cart.' });
        }

        const cartItem = cart.items[cartItemIndex];
        const quantityToRemove = cartItem.quantity;

        // Step 2: Remove the item completely from the cart
        cart.items.splice(cartItemIndex, 1);
        await cart.save();

        // Step 3: Update inventory
        const inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found for this product.' });
        }

        // Add the removed quantity back to the inventory
        inventory.stock += quantityToRemove;
        inventory.status =
            inventory.stock <= inventory.lowStockThreshold
                ? 'low-stock'
                : 'in-stock';
        await inventory.save();

        // Step 4: Update category-specific stock
        const category = await ProductCategories.findOne({
            _id: categoryId,
            productId,
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found for this product.' });
        }

        // Add the removed quantity back to the category
        category.availableUnits += quantityToRemove;
        await category.save();

        res.status(200).json({
            message: 'Item removed from cart successfully!',
            cart,
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
