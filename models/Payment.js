const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to Order
        required: true,
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Buyer
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Stripe', 'Card'], // Extendable with 'Card'
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending',
    },
    transactionId: {
        type: String,
        unique: true,
    },
    cardDetails: {
        cardHolderName: {
            type: String,
            default: null, // Optional field
        },
        cardNumber: {
            type: String,
            default: null, // Optional field
        },
        validTill: {
            type: String,
            default: null, // Optional field
        },
        brand: {
            type: String,
            default: null, // Optional field
        },
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

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
