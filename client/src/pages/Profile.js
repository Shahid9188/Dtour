import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Local state for profile form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currency, setCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call for now since we don't have a profile update endpoint
        setTimeout(() => {
            setLoading(false);
            toast.success('Profile updated successfully!');
        }, 1000);
    };

    const inputStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: '1.5px solid var(--cream-dark)',
        fontSize: '1rem',
        outline: 'none',
        background: 'var(--cream)',
        color: 'var(--ink)',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s'
    };

    if (!user) return null;

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '2rem' }}>
                Account <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>Settings</em>
            </h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Personality Card */}
                <div style={{ background: 'var(--warm-white)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--cream-dark)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(196,97,58,0.06), transparent 70%)', pointerEvents: 'none' }} />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Your Travel Persona</h3>
                    {user.travelPersonality ? (
                        <div>
                            <div style={{ display: 'inline-block', background: 'rgba(196,97,58,0.08)', color: 'var(--terra)', padding: '8px 20px', borderRadius: '100px', fontWeight: 500, fontSize: '1rem', marginBottom: '1rem' }}>
                                {user.travelPersonality}
                            </div>
                            <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem', fontWeight: 300, marginBottom: '1.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
                                DTOUR uses this persona to shape every itinerary generated for you. If you feel your travel style has changed, you can retake the quiz.
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem', fontWeight: 300, marginBottom: '1.5rem' }}>
                            You haven't discovered your travel personality yet.
                        </p>
                    )}
                    
                    <button 
                        onClick={() => navigate('/quiz')}
                        style={{ padding: '0.8rem 1.8rem', background: 'var(--ink)', color: 'var(--cream)', borderRadius: '100px', border: 'none', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' }}
                        onMouseEnter={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.target.style.background = 'var(--ink)'; e.target.style.transform = 'none'; }}
                    >
                        {user.travelPersonality ? 'Retake Quiz' : 'Take the Quiz'}
                    </button>
                </div>

                {/* Profile Details Form */}
                <div style={{ background: 'var(--warm-white)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--cream-dark)' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem' }}>Personal Details</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    style={inputStyle} 
                                    onFocus={e => { e.target.style.borderColor = 'var(--terra)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--cream-dark)'; }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Email Address</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    style={inputStyle} 
                                    onFocus={e => { e.target.style.borderColor = 'var(--terra)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--cream-dark)'; }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Default Currency</label>
                            <select 
                                value={currency} 
                                onChange={e => setCurrency(e.target.value)} 
                                style={{ ...inputStyle, width: '50%' }}
                                onFocus={e => { e.target.style.borderColor = 'var(--terra)'; }}
                                onBlur={e => { e.target.style.borderColor = 'var(--cream-dark)'; }}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="AUD">AUD ($)</option>
                                <option value="CAD">CAD ($)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--cream-dark)', paddingTop: '1.5rem' }}>
                            <button 
                                type="button"
                                onClick={logout}
                                style={{ padding: '0.8rem 1.8rem', background: 'transparent', color: '#C4613A', border: '1px solid rgba(196,97,58,0.2)', borderRadius: '100px', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.background = 'rgba(196,97,58,0.05)'; }}
                                onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                            >
                                Sign Out
                            </button>

                            <button 
                                type="submit"
                                disabled={loading}
                                style={{ padding: '0.8rem 2.5rem', background: 'var(--terra)', color: 'var(--warm-white)', borderRadius: '100px', border: 'none', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(196,97,58,0.25)', transition: 'background 0.2s, transform 0.15s', opacity: loading ? 0.7 : 1 }}
                                onMouseEnter={e => { if(!loading) { e.target.style.background = '#B05530'; e.target.style.transform = 'translateY(-1px)'; } }}
                                onMouseLeave={e => { if(!loading) { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'none'; } }}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
