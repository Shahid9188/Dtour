const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const { calculateSplit, calculateBalances, generateSettlements } = require('../services/expenseService');

exports.addExpense = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        let { title, amount, currency, category, splitType, splitAmong, notes, date } = req.body;

        // Process splitAmong through expense service
        splitAmong = calculateSplit(amount, splitType, splitAmong);

        const expense = await Expense.create({
            trip: tripId,
            title,
            amount,
            currency,
            category,
            paidBy: { email: req.user.email, name: req.user.name },
            splitType,
            splitAmong,
            notes,
            date
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTripExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ trip: req.params.tripId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBalances = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const expenses = await Expense.find({ trip: tripId });
        const trip = await Trip.findById(tripId);

        const namesMap = {};
        if (trip) {
            trip.members.forEach(m => { namesMap[m.email] = m.name; });
        }

        const balances = calculateBalances(expenses);
        const settlements = generateSettlements(balances, namesMap);

        res.json({ balances, settlements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.settleExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.expenseId);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        expense.isSettled = true;
        await expense.save();
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.expenseId);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.paidBy.email !== req.user.email) {
            return res.status(403).json({ message: 'Only payer can update expense' });
        }

        let { amount, splitType, splitAmong } = req.body;
        if (amount !== undefined && splitType && splitAmong) {
            req.body.splitAmong = calculateSplit(amount, splitType, splitAmong);
        }

        Object.assign(expense, req.body);
        await expense.save();
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.expenseId);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.paidBy.email !== req.user.email) {
            return res.status(403).json({ message: 'Only payer can delete' });
        }

        await expense.deleteOne();
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
