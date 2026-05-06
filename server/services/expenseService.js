const calculateSplit = (amount, splitType, members) => {
    const numMembers = members.length;
    if (numMembers === 0) return [];

    const updatedMembers = [...members];

    if (splitType === 'equal' || splitType === 'selected') {
        const splitAmount = Number((amount / numMembers).toFixed(2));
        let currentTotal = 0;

        updatedMembers.forEach((m, idx) => {
            if (idx === numMembers - 1) {
                m.amount = Number((amount - currentTotal).toFixed(2));
            } else {
                m.amount = splitAmount;
                currentTotal += splitAmount;
            }
        });
    } else if (splitType === 'percentage') {
        const totalPercentage = updatedMembers.reduce((sum, m) => sum + (m.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error('Percentages must equal 100');
        }
        updatedMembers.forEach(m => {
            m.amount = Number(((amount * m.percentage) / 100).toFixed(2));
        });
    } else if (splitType === 'custom') {
        const totalCustom = updatedMembers.reduce((sum, m) => sum + (m.amount || 0), 0);
        if (Math.abs(totalCustom - amount) > 0.01) {
            throw new Error('Custom amounts must equal total amount');
        }
    }

    return updatedMembers;
};

const calculateBalances = (expenses) => {
    const balances = {};

    expenses.forEach(expense => {
        if (expense.isSettled) return;

        const payer = expense.paidBy.email;
        if (!balances[payer]) balances[payer] = 0;
        balances[payer] += expense.amount;

        expense.splitAmong.forEach(split => {
            const debtor = split.email;
            if (!balances[debtor]) balances[debtor] = 0;
            balances[debtor] -= split.amount;
        });
    });

    return balances;
};

const generateSettlements = (balances, names) => {
    const creditors = [];
    const debtors = [];

    Object.keys(balances).forEach(email => {
        const amount = Number(balances[email].toFixed(2));
        if (amount > 0) creditors.push({ email, amount, name: names[email] || email });
        else if (amount < 0) debtors.push({ email, amount: Math.abs(amount), name: names[email] || email });
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0, j = 0;

    while (i < creditors.length && j < debtors.length) {
        const credit = creditors[i];
        const debt = debtors[j];

        const minAmount = Math.min(credit.amount, debt.amount);

        // Round to 2 decimal places to avoid floating point errors
        const settledAmount = Number(minAmount.toFixed(2));

        if (settledAmount > 0) {
            settlements.push({
                from: { email: debt.email, name: debt.name },
                to: { email: credit.email, name: credit.name },
                amount: settledAmount
            });
        }

        creditors[i].amount = Number((credit.amount - minAmount).toFixed(2));
        debtors[j].amount = Number((debt.amount - minAmount).toFixed(2));

        if (creditors[i].amount === 0) i++;
        if (debtors[j].amount === 0) j++;
    }

    return settlements;
};

const getExpenseAnalytics = (expenses) => {
    let totalAmount = 0;
    const categoryBreakdown = {};
    const memberSpending = {};

    expenses.forEach(expense => {
        totalAmount += expense.amount;

        categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;

        expense.splitAmong.forEach(split => {
            memberSpending[split.email] = (memberSpending[split.email] || 0) + split.amount;
        });
    });

    const categoryPercentages = {};
    if (totalAmount > 0) {
        Object.keys(categoryBreakdown).forEach(category => {
            categoryPercentages[category] = Number(((categoryBreakdown[category] / totalAmount) * 100).toFixed(2));
        });
    }

    return { categoryBreakdown, categoryPercentages, memberSpending, totalAmount };
};

module.exports = {
    calculateSplit,
    calculateBalances,
    generateSettlements,
    getExpenseAnalytics
};
