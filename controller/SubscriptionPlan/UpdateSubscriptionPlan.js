const { SubscriptionPlan } = require('../../models/SubscriptionPlan');

exports.UpdateSubscriptionPlan = async (req, res) => {
    const { planId, name, price, features } = req.body;

    try {
        const plan = await SubscriptionPlan.findById(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        // Update fields only if they are provided in the request
        if (name) plan.name = name;
        if (price) plan.price = price;
        if (features) plan.features = features;

        // Save the updated plan to the database
        await plan.save();

        res.status(200).json({
            message: 'Subscription plan updated successfully',
            plan,
        });
    } catch (error) {
        console.error('Error updating subscription plan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
