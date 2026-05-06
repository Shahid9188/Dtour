const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    travelPersonality: { type: String },
    personalityQuizAnswers: [{
        questionId: String,
        selectedValue: String,
        questionText: String,
        answer: String
    }],
    createdTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    preferences: { type: mongoose.Schema.Types.Mixed },
    resetOtp: { type: String, select: false },
    resetOtpExpires: { type: Date, select: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
