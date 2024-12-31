const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure price is non-negative
    },
    brand: {
        type: String,
        required: true
    },
    keyboardLanguage: {
        type: String
    },
    memory: {
        type: String
    },
    storage: {
        type: String
    },
    weight: {
        type: String
    },
    warranty: {
        type: String
    },
    warrantyType: {
        type: String
    },
    taxExcludedPrice: {
        type: Number,
        min: 0
    },
    taxIncludedPrice: {
        type: Number,
        min: 0
    },
    taxRule: {
        type: String
    },
    unitPrice: {
        type: Number,
        min: 0
    },
    minimumOrder: {
        type: Number,
        min: 1
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    discount: { // New discount field with default value
        type: Number,
        default: 0,
        min: 0 // Ensure discount is non-negative
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
