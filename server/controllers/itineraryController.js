const Itinerary = require('../models/Itinerary');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

exports.getTripItinerary = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ trip: req.params.tripId }).sort({ dayNumber: 1 });
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItineraryDay = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateItineraryDay = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        Object.assign(itinerary, req.body);
        await itinerary.save();
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addActivity = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        itinerary.activities.push(req.body);
        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        itinerary.activities = itinerary.activities.filter(act => act._id.toString() !== req.params.actId);
        await itinerary.save();
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleComplete = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        const activity = itinerary.activities.find(act => act._id.toString() === req.params.actId);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        activity.isCompleted = !activity.isCompleted;
        await itinerary.save();

        // Auto-create or remove expense based on completion status
        if (activity.isCompleted && activity.estimatedCost > 0) {
            // Create an expense for this completed activity
            const trip = await Trip.findById(itinerary.trip);
            const membersList = trip ? trip.members.map(m => ({ email: m.email, name: m.name, amount: 0 })) : [];

            // For solo trips or if only one member, create a simple expense
            const splitAmount = membersList.length > 0 ? activity.estimatedCost / membersList.length : activity.estimatedCost;
            const splitAmong = membersList.length > 0
                ? membersList.map(m => ({ ...m, amount: splitAmount }))
                : [{ email: req.user.email, name: req.user.name, amount: activity.estimatedCost }];

            await Expense.create({
                trip: itinerary.trip,
                title: `${activity.title}`,
                amount: activity.estimatedCost,
                currency: activity.currency || 'USD',
                category: 'activity',
                paidBy: { email: req.user.email, name: req.user.name },
                splitType: 'equal',
                splitAmong,
                date: itinerary.date,
                notes: `Auto-added from itinerary Day ${itinerary.dayNumber}`,
                activityId: activity._id.toString()
            });
        } else if (!activity.isCompleted) {
            // Remove the auto-created expense when activity is un-done
            await Expense.deleteOne({
                trip: itinerary.trip,
                activityId: activity._id.toString()
            });
        }

        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

