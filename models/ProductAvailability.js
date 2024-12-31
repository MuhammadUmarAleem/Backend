const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productAvailabilitySchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        ref: 'Product',
        required: true
    },
    accept_Order: {
        type: Boolean,
        default: false
    },
    available_now: {
        type: Boolean,
        default: false
    },
    available_later: {
        type: Boolean,
        default: false
    },
    made_offer: {
        type: Boolean,
        default: false
    },
    allow_customization: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically create createdAt and updatedAt timestamps
});

const ProductAvailability = mongoose.model('ProductAvailability', productAvailabilitySchema);
module.exports = ProductAvailability;
