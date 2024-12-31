const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategoriesSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Product model
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    availableUnits: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt timestamps
});

const ProductCategories = mongoose.model('ProductCategories', productCategoriesSchema);
module.exports = ProductCategories;
