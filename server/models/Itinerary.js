const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String },
    location: { type: String },
    address: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    estimatedCost: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    notes: { type: String },
    isCompleted: { type: Boolean, default: false },
    weatherDependent: { type: Boolean, default: false },
    indoorAlternative: { type: String }
});

const itinerarySchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    dayNumber: { type: Number, required: true },
    date: { type: Date, required: true },
    theme: { type: String },
    activities: [activitySchema],
    totalDayCost: { type: Number, default: 0 },
    aiTips: [{ type: String }],
    isReplanned: { type: Boolean, default: false }
}, { timestamps: true });

itinerarySchema.pre('save', function (next) {
    this.totalDayCost = this.activities.reduce((total, act) => total + (act.estimatedCost || 0), 0);
    next();
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
