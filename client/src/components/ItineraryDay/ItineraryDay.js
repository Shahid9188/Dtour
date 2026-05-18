import React, { useState } from 'react';
import { itineraryAPI } from '../../services/api';

const ItineraryDay = ({ dayData, onUpdate, onReplan, onExpenseChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const handleToggleComplete = async (actId) => { const res = await itineraryAPI.toggleComplete(dayData._id, actId); onUpdate(res); if (onExpenseChange) onExpenseChange(); };
    const handleDelete = async (actId) => { const res = await itineraryAPI.deleteActivity(dayData._id, actId); onUpdate(res); };
    const handleEditClick = (act) => { setEditingId(act._id); setEditForm({ ...act }); };
    const handleSaveEdit = async () => {
        const newActivities = dayData.activities.map(a => a._id === editingId ? editForm : a);
        const res = await itineraryAPI.updateDay(dayData._id, { activities: newActivities }); onUpdate(res); setEditingId(null);
    };

    const btnStyle = { background: 'none', border: 'none', color: 'var(--terra)', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', padding: '4px 0', transition: 'opacity 0.2s' };

    return (
        <div style={{ background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.2rem', transition: 'box-shadow 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--terra)', color: 'var(--warm-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>{dayData.dayNumber}</div>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{dayData.theme || 'Day Plan'}</h3>
                        <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: '0.85rem', fontWeight: 300 }}>{new Date(dayData.date).toLocaleDateString()} · {dayData.activities?.length} activities</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink)', fontSize: '1rem' }}>${dayData.totalDayCost || 0}</span>
                    <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--ink-muted)', fontSize: '0.8rem' }}>▼</div>
                </div>
            </div>

            {isExpanded && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {[{ label: '🌧️ Rain', reason: 'Raining', bg: 'rgba(122,155,118,0.1)' }, { label: '💸 Expensive', reason: 'Too expensive', bg: 'rgba(196,97,58,0.08)' }, { label: '😴 Tired', reason: 'Exhausted', bg: 'rgba(138,103,122,0.08)' }].map(r => (
                            <button key={r.reason} onClick={() => onReplan(dayData._id, r.reason)} style={{ ...btnStyle, background: r.bg, padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem' }}>{r.label}</button>
                        ))}
                    </div>

                    {dayData.aiTips && dayData.aiTips.length > 0 && (
                        <div style={{ background: 'rgba(196,97,58,0.04)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(196,97,58,0.08)' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--terra)' }}>AI Tips:</strong>
                            <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--ink-muted)', fontWeight: 300 }}>
                                {dayData.aiTips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </div>
                    )}

                    {dayData.activities?.map((act, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--cream)', borderRadius: '14px', marginTop: '0.8rem', borderLeft: '3px solid var(--terra)', opacity: act.isCompleted ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                            <div style={{ flex: 1 }}>
                                {editingId === act._id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ padding: '8px 12px', border: '1px solid var(--terra-light)', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit' }} />
                                        <input value={editForm.startTime} onChange={e => setEditForm({ ...editForm, startTime: e.target.value })} style={{ padding: '8px 12px', border: '1px solid var(--terra-light)', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit' }} />
                                        <input type="number" value={editForm.estimatedCost} onChange={e => setEditForm({ ...editForm, estimatedCost: e.target.value })} style={{ padding: '8px 12px', border: '1px solid var(--terra-light)', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit' }} />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={handleSaveEdit} style={btnStyle}>Save</button>
                                            <button onClick={() => setEditingId(null)} style={{ ...btnStyle, color: 'var(--ink-muted)' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h4 style={{ margin: 0, textDecoration: act.isCompleted ? 'line-through' : 'none', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem' }}>{act.title}</h4>
                                        <p style={{ margin: '4px 0', fontSize: '0.82rem', color: 'var(--terra)', fontWeight: 500 }}>{act.startTime} {act.endTime ? `– ${act.endTime}` : ''} · {act.estimatedCost ? `$${act.estimatedCost}` : 'Free'}</p>
                                        {act.location && <p style={{ margin: '4px 0', fontSize: '0.82rem', color: 'var(--ink-muted)', fontWeight: 300 }}>📍 {act.location}</p>}
                                        {act.notes && <p style={{ margin: '8px 0 0 0', fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--ink-muted)', fontWeight: 300 }}>{act.notes}</p>}
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                            <button onClick={() => handleToggleComplete(act._id)} style={btnStyle}>{act.isCompleted ? 'Undo' : 'Mark Done'}</button>
                                            <button onClick={() => handleEditClick(act)} style={{ ...btnStyle, color: 'var(--ink-muted)' }}>Edit</button>
                                            <button onClick={() => handleDelete(act._id)} style={{ ...btnStyle, color: '#B05530' }}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItineraryDay;
