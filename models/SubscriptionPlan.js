const mongoose = require('mongoose');

// Schema for a Subscription Plan
const subscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., Free, Standard, Premium
    price: { type: Number, required: true }, // Cost per week
    features: { type: [String], required: true }, // List of included features
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true 
});

// Define models
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = {
    SubscriptionPlan,
};
