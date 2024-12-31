const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productImagesSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Product model
        ref: 'Product',
        required: true
    },
    Image: {
        type: String,
        maxlength: 100,
        required: true
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt timestamps
});

const ProductImages = mongoose.model('ProductImages', productImagesSchema);
module.exports = ProductImages;
