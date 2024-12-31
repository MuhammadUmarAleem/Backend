const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
    {
        businessName: { type: String, required: true },
        province: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        telephone: { type: String, default: null },
        dateOfBirth: { type: Date, required: true },
        website: { type: String, default: null },
        secretQuestion: { type: String, required: true },
        secretAnswer: { type: String, required: true },
        documentUrl: { type: String, default: null },
        about: { type: String, default: null },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model
        totalRevenue: { type: Number, default: 0 }, // Default 0
        walletBalance: { type: Number, default: 0 }, // Default 0
        cardHolderName: { type: String, default: null }, // Default null
        cardNumber: { type: String, default: null }, // Default null
        validDate: { type: String, default: null }, // Default null
        cvv: { type: String, default: null }, // Default null
    },
    { timestamps: true }
);

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
