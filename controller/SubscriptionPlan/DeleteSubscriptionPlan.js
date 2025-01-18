const { SubscriptionPlan } = require('../../models/SubscriptionPlan');

exports.DeleteSubscriptionPlan = async (req, res) => {


    const { planId } = req.params;

    try {
        const plan = await SubscriptionPlan.findById(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }

        // Delete the subscription plan
        await plan.remove();

        res.status(200).json({
            message: 'Subscription plan deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting subscription plan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};