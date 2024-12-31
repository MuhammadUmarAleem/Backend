const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryDimensionsSchema = new Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Product model
        ref: 'ProductCategories',
        required: true
    },
    length: {
        type: Number,
        default: null
    },
    width: {
        type: Number,
        default: null
    },
    height: {
        type: Number,
        default: null
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt timestamps
});

const CategoryDimensions = mongoose.model('CategoryDimensions', categoryDimensionsSchema);
module.exports = CategoryDimensions;
