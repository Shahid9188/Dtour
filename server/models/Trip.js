const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['solo', 'group'], required: true },
    destination: { type: String, required: true },
    country: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    personalityType: { type: String },
    budget: {
        total: { type: Number },
        currency: { type: String, default: 'USD' },
        breakdown: { type: mongoose.Schema.Types.Mixed }
    },
    season: { type: String },
    activityPreferences: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: { type: String, required: true },
        name: { type: String },
        role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' },
        status: { type: String, enum: ['active', 'invited'], default: 'invited' },
        inviteToken: { type: String },
        joinedAt: { type: Date }
    }],
    itinerary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }],
    status: { type: String, enum: ['planning', 'upcoming', 'completed'], default: 'planning' },
    aiGenerated: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

tripSchema.virtual('duration').get(function () {
    if (!this.startDate || !this.endDate) return 0;
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

module.exports = mongoose.model('Trip', tripSchema);
