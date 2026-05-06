import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import ItineraryDay from '../components/ItineraryDay/ItineraryDay';
import ExpenseCard from '../components/ExpenseCard/ExpenseCard';
import ChatWidget from '../components/ChatWidget/ChatWidget';

const TripDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentTrip, itinerary, expenses, balances, settlements, fetchTrip, fetchItinerary, fetchExpenses, generateItinerary, addExpense, inviteMember, isGenerating, setItinerary } = useTrip();
    const [activeTab, setActiveTab] = useState('overview');
    const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'food', splitType: 'equal' });
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => { fetchTrip(id); fetchItinerary(id); fetchExpenses(id); }, [id, fetchTrip, fetchItinerary, fetchExpenses]);

    const handleReplanDay = async (itineraryId, reason) => {
        try { toast.loading('Replanning...', { id: 'replan' }); await aiAPI.replanDay(itineraryId, { reason, autoApply: true }); await fetchItinerary(id); toast.success('Day replanned!', { id: 'replan' }); }
        catch (err) { toast.error('Failed to replan', { id: 'replan' }); }
    };

    const submitExpense = async (e) => {
        e.preventDefault();
        const membersList = currentTrip.members.map(m => ({ email: m.email, name: m.name }));
        await addExpense(id, { ...expenseForm, amount: Number(expenseForm.amount), splitAmong: membersList });
        setExpenseForm({ title: '', amount: '', category: 'food', splitType: 'equal' });
    };

    if (!currentTrip) return <div style={{ paddingTop: '100px', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-muted)' }}>Loading trip...</div>;

    const tabs = ['overview', 'itinerary', 'budget', 'expenses'];
    if (currentTrip.type === 'group') tabs.push('members');
    const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = currentTrip.budget?.total || 0;
    const budgetPct = totalBudget ? Math.min((totalCost / totalBudget) * 100, 100) : 0;
    const inputStyle = { flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--cream-dark)', fontFamily: 'inherit', fontSize: '0.9rem', background: 'var(--cream)', color: 'var(--ink)', outline: 'none' };

    return (
        <div style={{ paddingBottom: '12rem', paddingTop: '100px' }}>
            {/* Sticky Header */}
            <div style={{ position: 'sticky', top: '70px', zIndex: 900, background: 'rgba(249,246,239,0.9)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--cream-dark)', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate('/dashboard')} style={{ background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: '1rem', transition: 'border-color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--terra)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--cream-dark)'}
                        >←</button>
                        <div style={{ fontSize: '2rem' }}>📍</div>
                        <div>
                            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 }}>{currentTrip.title}</h1>
                            <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: '0.85rem', fontWeight: 300 }}>{currentTrip.destination} · {new Date(currentTrip.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button onClick={() => generateItinerary(id)} disabled={isGenerating} style={{
                        padding: '0.6rem 1.4rem', background: isGenerating ? 'var(--ink-muted)' : 'var(--terra)',
                        color: 'var(--warm-white)', border: 'none', borderRadius: '100px', fontWeight: 500,
                        cursor: isGenerating ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: isGenerating ? 0.7 : 1,
                        boxShadow: '0 4px 16px rgba(196,97,58,0.2)', transition: 'background 0.2s',
                    }}>{isGenerating ? 'Generating...' : 'Regenerate ✦'}</button>
                </div>

                <div style={{ maxWidth: '1200px', margin: '1.2rem auto 0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            padding: '8px 18px', background: activeTab === tab ? 'var(--ink)' : 'transparent',
                            color: activeTab === tab ? 'var(--cream)' : 'var(--ink-muted)', border: 'none',
                            borderRadius: '100px', fontWeight: activeTab === tab ? 500 : 300, textTransform: 'capitalize',
                            cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', letterSpacing: '0.02em',
                        }}>{tab}</button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
                            {[{ label: 'Itinerary Length', value: `${currentTrip.duration}`, unit: 'Days' }, { label: 'Total Spent', value: `$${totalCost.toFixed(2)}`, color: 'var(--sage)' }, { label: 'Activities', value: itinerary.reduce((sum, d) => sum + (d.activities?.length || 0), 0) }].map((s, i) => (
                                <div key={i} style={{ background: 'var(--warm-white)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--cream-dark)' }}>
                                    <h4 style={{ color: 'var(--ink-muted)', margin: '0 0 10px 0', fontWeight: 300, fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>{s.label}</h4>
                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: s.color || 'var(--ink)' }}>{s.value} {s.unit && <span style={{ fontSize: '0.9rem', fontWeight: 300 }}>{s.unit}</span>}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'var(--warm-white)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--cream-dark)', marginBottom: '2rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 1rem 0', fontWeight: 600, fontSize: '1.15rem' }}>Budget Progress</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 300 }}><span>${totalCost.toFixed(2)} spent</span><span>${totalBudget} total</span></div>
                            <div style={{ height: '6px', background: 'var(--cream-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: budgetPct > 90 ? '#B05530' : 'var(--sage)', width: `${budgetPct}%`, transition: 'width 0.5s ease', borderRadius: '4px' }} />
                            </div>
                        </div>
                        {itinerary[0] && (<div><h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontWeight: 600, fontSize: '1.15rem' }}>Sneak Peek: Day 1</h3><ItineraryDay dayData={itinerary[0]} onUpdate={async () => fetchItinerary(id)} onReplan={handleReplanDay} /></div>)}
                    </div>
                )}

                {/* ITINERARY */}
                {activeTab === 'itinerary' && (
                    <div>{itinerary.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--warm-white)', borderRadius: '20px', border: '1px solid var(--cream-dark)' }}>
                            <p style={{ color: 'var(--ink-muted)', fontWeight: 300, marginBottom: '1rem' }}>No itinerary generated yet.</p>
                            <button onClick={() => generateItinerary(id)} style={{ padding: '0.7rem 1.5rem', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 500 }}>Generate Now</button>
                        </div>
                    ) : itinerary.map((day, i) => <ItineraryDay key={i} dayData={day} onUpdate={async () => fetchItinerary(id)} onReplan={handleReplanDay} />)}</div>
                )}

                {/* BUDGET */}
                {activeTab === 'budget' && (
                    <div style={{ background: 'var(--warm-white)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--cream-dark)' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.4rem', marginBottom: '2rem' }}>Category Breakdown</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {['food', 'transport', 'accommodation', 'activity', 'mixed'].map(cat => {
                                const amount = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                                if (amount === 0) return null;
                                const pct = (amount / totalCost) * 100;
                                return (<div key={cat}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', textTransform: 'capitalize', fontWeight: 500, fontSize: '0.9rem' }}><span>{cat}</span><span style={{ color: 'var(--terra)' }}>${amount.toFixed(2)} ({pct.toFixed(1)}%)</span></div><div style={{ height: '4px', background: 'var(--cream-dark)', borderRadius: '4px' }}><div style={{ height: '100%', background: 'linear-gradient(to right, var(--terra), var(--sand))', width: `${pct}%`, borderRadius: '4px' }} /></div></div>);
                            })}
                            {totalCost === 0 && <p style={{ color: 'var(--ink-muted)', fontWeight: 300 }}>No expenses added yet.</p>}
                        </div>
                    </div>
                )}

                {/* EXPENSES */}
                {activeTab === 'expenses' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                        <div>
                            <div style={{ background: 'var(--warm-white)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem', border: '1px solid var(--cream-dark)' }}>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>Add Expense</h3>
                                <form onSubmit={submitExpense} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <input placeholder="Title" value={expenseForm.title} onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })} style={{ ...inputStyle, flex: 2 }} required />
                                    <input placeholder="Amount" type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} style={inputStyle} required />
                                    <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })} style={inputStyle}>
                                        <option value="food">Food</option><option value="transport">Transport</option><option value="accommodation">Accommodation</option><option value="activity">Activity</option>
                                    </select>
                                    <button style={{ padding: '10px 20px', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '100px', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem' }}>Add</button>
                                </form>
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>All Expenses</h3>
                            {expenses.map(exp => <ExpenseCard key={exp._id} expense={exp} onSettle={async (eId) => { await aiAPI.settleExpense(eId); fetchExpenses(id); }} />)}
                        </div>
                        <div>
                            <div style={{ background: 'var(--terra)', color: 'var(--warm-white)', padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--warm-white)', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem' }}>Balances</h3>
                                {Object.keys(balances).length === 0 ? <p style={{ fontWeight: 300 }}>All settled up!</p> : null}
                                {Object.keys(balances).map(email => (
                                    <div key={email} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.15)', fontWeight: 300 }}>
                                        <span>{email.split('@')[0]}</span><span style={{ fontWeight: 600 }}>{balances[email] > 0 ? '+' : ''}{balances[email]?.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            {settlements.length > 0 && (
                                <div style={{ background: 'var(--warm-white)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--cream-dark)' }}>
                                    <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem' }}>Suggested Settlements</h3>
                                    {settlements.map((s, i) => (
                                        <div key={i} style={{ fontSize: '0.88rem', marginBottom: '10px', background: 'var(--cream)', padding: '10px 12px', borderRadius: '10px', fontWeight: 300 }}>
                                            <strong style={{ fontWeight: 500 }}>{s.from.name || s.from.email.split('@')[0]}</strong> owes <strong style={{ fontWeight: 500 }}>{s.to.name || s.to.email.split('@')[0]}</strong>
                                            <div style={{ color: 'var(--terra)', fontWeight: 600, marginTop: '4px' }}>${s.amount?.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MEMBERS */}
                {activeTab === 'members' && currentTrip.type === 'group' && (
                    <div style={{ background: 'var(--warm-white)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--cream-dark)' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.4rem' }}>Trip Members</h2>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                            <input type="email" placeholder="email@address.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--cream-dark)', fontFamily: 'inherit', fontSize: '0.9rem', background: 'var(--cream)', outline: 'none' }} />
                            <button onClick={async () => { await inviteMember(id, { email: inviteEmail }); setInviteEmail(''); fetchTrip(id); }} style={{ padding: '12px 24px', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '100px', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem' }}>Invite</button>
                        </div>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {currentTrip.members.map((m, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--cream)', borderRadius: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, var(--terra), var(--sand))', color: 'var(--warm-white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>{m.name ? m.name.charAt(0).toUpperCase() : m.email.charAt(0).toUpperCase()}</div>
                                        <div><div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{m.name || m.email}</div><div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontWeight: 300 }}>{m.email}</div></div>
                                    </div>
                                    <div style={{ background: m.status === 'active' ? 'rgba(122,155,118,0.1)' : 'rgba(196,97,58,0.08)', color: m.status === 'active' ? '#5A7A56' : '#C4613A', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize' }}>{m.status} · {m.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ChatWidget trip={currentTrip} />
        </div>
    );
};

export default TripDashboard;
