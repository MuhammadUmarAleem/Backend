const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Product model
        ref: 'Product',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0, // Default stock quantity
        min: 0      // Ensure stock is non-negative
    },
    status: {
        type: String,
        enum: ['in-stock', 'low-stock', 'out-of-stock'], // Stock status
        default: 'in-stock'
    },
    lowStockThreshold: {
        type: Number,
        default: 5 // Default threshold for low stock
    },
    reorderLevel: {
        type: Number,
        default: null // Optional field for reorder level
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Seller (or User)
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt timestamps
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
