const aiService = require('../services/geminiService');
const { QUIZ_QUESTIONS } = require('../services/quizService');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Expense = require('../models/Expense');

exports.getQuizQuestions = (req, res) => {
    // Strip tags so client just sees questions
    const sanitized = QUIZ_QUESTIONS.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options.map(o => ({ text: o.text }))
    }));
    res.json(sanitized);
};

exports.generateItinerary = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        // If itinerary already exists, delete it first
        await Itinerary.deleteMany({ trip: tripId });

        const itineraryData = await aiService.generateItinerary(trip);

        const createdDays = await Promise.all(
            itineraryData.map(async (dayData, idx) => {
                return await Itinerary.create({
                    trip: tripId,
                    dayNumber: dayData.dayNumber || idx + 1,
                    date: dayData.date || new Date(trip.startDate.getTime() + (idx * 24 * 60 * 60 * 1000)),
                    theme: dayData.theme,
                    activities: dayData.activities,
                    aiTips: dayData.aiTips
                });
            })
        );

        trip.itinerary = createdDays.map(d => d._id);
        trip.aiGenerated = true;
        await trip.save();

        res.json({ message: 'Itinerary generated', itineraries: createdDays });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.replanDay = async (req, res) => {
    try {
        const itineraryDay = await Itinerary.findById(req.params.itineraryId).populate('trip');
        if (!itineraryDay) return res.status(404).json({ message: 'Itinerary not found' });

        const { reason, autoApply } = req.body;

        const newPlan = await aiService.replanItinerary(itineraryDay.activities, reason, itineraryDay.trip);

        if (autoApply) {
            itineraryDay.activities = newPlan.suggestedChanges || newPlan;
            itineraryDay.isReplanned = true;
            await itineraryDay.save();
            res.json(itineraryDay);
        } else {
            res.json({ suggestedChanges: newPlan.suggestedChanges || newPlan });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.chat = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await Trip.findById(tripId).populate('itinerary');
        const { history, message } = req.body;

        const result = await aiService.chatAssistant(history, message, trip);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBudgetOptimization = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await Trip.findById(tripId).populate('itinerary');
        const expenses = await Expense.find({ trip: tripId });

        const result = await aiService.optimizeBudget({ trip, expenses });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
