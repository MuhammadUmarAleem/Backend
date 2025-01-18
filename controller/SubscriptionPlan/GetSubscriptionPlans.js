const { SubscriptionPlan } = require('../../models/SubscriptionPlan');

exports.GetSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.status(200).json({
            plans,
        });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};