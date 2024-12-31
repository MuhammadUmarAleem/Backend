const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productTagSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true
    },
    tag: {
        type: String,
        required: true,
        maxlength: 50
    }
}, {
    timestamps: true // Automatically create createdAt and updatedAt timestamps
});

const ProductTag = mongoose.model('ProductTag', productTagSchema);
module.exports = ProductTag;
