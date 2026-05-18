const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    category: { type: String, required: true },
    paidBy: {
        email: { type: String, required: true },
        name: { type: String }
    },
    splitType: { type: String, enum: ['equal', 'percentage', 'custom', 'selected'], default: 'equal' },
    splitAmong: [{
        email: { type: String, required: true },
        name: { type: String },
        amount: { type: Number, required: true },
        percentage: { type: Number },
        isPaid: { type: Boolean, default: false }
    }],
    date: { type: Date, default: Date.now },
    notes: { type: String },
    isSettled: { type: Boolean, default: false },
    activityId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
