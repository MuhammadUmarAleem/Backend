const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Buyer
        required: true,
    },
    buyerDetail: {
        firstname: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        apartment: {
            type: String, // Optional
        },
        city: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
        },
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to Product
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true, // Store price at the time of order placement
            },
            refund: {
                type: Boolean,
                default: false,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Refunded'],
        default: 'Unpaid',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
