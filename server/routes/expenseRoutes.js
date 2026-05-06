const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.route('/trip/:tripId')
    .get(protect, expenseController.getTripExpenses)
    .post(protect, expenseController.addExpense);

router.get('/trip/:tripId/balances', protect, expenseController.getBalances);

router.put('/:expenseId/settle', protect, expenseController.settleExpense);

router.route('/:expenseId')
    .put(protect, expenseController.updateExpense)
    .delete(protect, expenseController.deleteExpense);

module.exports = router;
