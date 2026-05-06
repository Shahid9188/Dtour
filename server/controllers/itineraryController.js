const Itinerary = require('../models/Itinerary');

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
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
