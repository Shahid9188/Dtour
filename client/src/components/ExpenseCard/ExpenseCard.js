import React from 'react';

const ExpenseCard = ({ expense, onSettle }) => {
    const getIcon = (cat) => {
        const icons = { food: '🍔', transport: '🚕', accommodation: '🏨', activity: '🎟️', mixed: '🏷️' };
        return icons[cat?.toLowerCase()] || '💸';
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.2rem', background: expense.isSettled ? 'var(--cream)' : 'var(--warm-white)',
            borderRadius: '14px', marginBottom: '0.8rem', border: '1px solid var(--cream-dark)',
            transition: 'box-shadow 0.2s',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.6rem', opacity: expense.isSettled ? 0.4 : 1 }}>{getIcon(expense.category)}</div>
                <div>
                    <h4 style={{ margin: 0, textDecoration: expense.isSettled ? 'line-through' : 'none', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem' }}>{expense.title}</h4>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: 'var(--ink-muted)', fontWeight: 300 }}>
                        Paid by <strong style={{ fontWeight: 500 }}>{expense.paidBy.name || expense.paidBy.email}</strong> on {new Date(expense.date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--ink-muted)', fontWeight: 300 }}>
                        Split {expense.splitType} among {expense.splitAmong.length} people
                    </p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.15rem', color: expense.isSettled ? 'var(--ink-muted)' : 'var(--ink)' }}>${expense.amount?.toFixed(2)}</div>
                {!expense.isSettled && (
                    <button onClick={() => onSettle(expense._id)} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontWeight: 500, cursor: 'pointer', fontSize: '0.82rem', marginTop: '4px', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#5A7A56'}
                        onMouseLeave={e => e.target.style.color = 'var(--sage)'}
                    >Mark Settled ✓</button>
                )}
            </div>
        </div>
    );
};

export default ExpenseCard;
