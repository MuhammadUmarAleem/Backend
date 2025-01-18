const { SubscriptionPlan } = require('../../models/SubscriptionPlan');

exports.AddSubscriptionPlan = async (req, res) => {
    const { name, price, features } = req.body;

    try {
        const newPlan = new SubscriptionPlan({
            name,
            price,
            features,
        });

        await newPlan.save();
        res.status(201).json({
            message: 'Subscription plan created successfully',
            plan: newPlan,
        });
    } catch (error) {
        console.error('Error creating subscription plan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


