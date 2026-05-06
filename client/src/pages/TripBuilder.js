import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TripBuilder = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        title: 'My Awesome Trip', type: 'solo', destination: '', startDate: '', endDate: '',
        personalityType: '', budgetTotal: '', currency: 'USD', activityPreferences: [], season: ''
    });
    const { createTrip, generateItinerary, fetchTrips } = useTrip();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.travelPersonality) setFormData(prev => ({ ...prev, personalityType: user.travelPersonality }));
    }, [user]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleFinish = async () => {
        try {
            const payload = {
                title: formData.title || `Trip to ${formData.destination}`, type: formData.type,
                destination: formData.destination, startDate: formData.startDate, endDate: formData.endDate,
                personalityType: formData.personalityType, budget: { total: Number(formData.budgetTotal), currency: formData.currency },
                season: formData.season, activityPreferences: formData.activityPreferences
            };
            const trip = await createTrip(payload);
            await generateItinerary(trip._id);
            await fetchTrips();
            navigate(`/trips/${trip._id}`);
        } catch (err) { console.error(err); }
    };

    const stepsHeader = ['Trip Type', 'Style', 'Logistics', 'Destination', 'Review'];
    const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid var(--cream-dark)', fontSize: '1rem', outline: 'none', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' };

    const optionBtn = (selected) => ({
        flex: 1, padding: '2rem', background: selected ? 'var(--terra)' : 'var(--warm-white)',
        color: selected ? 'var(--warm-white)' : 'var(--ink)', border: selected ? 'none' : '1px solid var(--cream-dark)',
        borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.1rem',
        fontWeight: selected ? 600 : 400, fontFamily: 'var(--font-serif)',
        boxShadow: selected ? '0 4px 20px rgba(196,97,58,0.28)' : 'none',
    });

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '700px', padding: '0 2rem' }}>
                {/* Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '1px', background: 'var(--cream-dark)', zIndex: 0 }} />
                    {stepsHeader.map((s, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: step >= i ? 'var(--terra)' : 'var(--warm-white)',
                                border: step >= i ? 'none' : '1.5px solid var(--cream-dark)',
                                color: step >= i ? 'var(--warm-white)' : 'var(--ink-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-serif)', fontSize: '0.9rem',
                                transition: 'all 0.3s',
                                boxShadow: step >= i ? '0 2px 10px rgba(196,97,58,0.2)' : 'none',
                            }}>{i + 1}</div>
                            <span style={{ fontSize: '0.75rem', color: step >= i ? 'var(--ink)' : 'var(--ink-muted)', fontWeight: step >= i ? 500 : 300 }}>{s}</span>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '2.5rem', background: 'var(--warm-white)', borderRadius: '24px', border: '1px solid var(--cream-dark)', boxShadow: '0 16px 40px rgba(28,26,22,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(196,97,58,0.06), transparent 70%)', pointerEvents: 'none' }} />

                    {step === 0 && (
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.6rem', marginBottom: '0.5rem' }}>Who's traveling?</h2>
                            <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontWeight: 300, fontSize: '0.95rem' }}>DTOUR adapts entirely whether you are alone or with friends.</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={optionBtn(formData.type === 'solo')} onClick={() => setFormData({ ...formData, type: 'solo' })}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👤</div> Solo Trip
                                </button>
                                <button style={optionBtn(formData.type === 'group')} onClick={() => setFormData({ ...formData, type: 'group' })}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👥</div> Group Trip
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.6rem', marginBottom: '0.5rem' }}>Trip Personality</h2>
                            <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontWeight: 300 }}>How do you want to experience this trip?</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {['Explorer', 'Luxury Seeker', 'Adventure Traveler', 'Culture Enthusiast', 'Relaxation Traveler'].map(p => (
                                    <button key={p} onClick={() => setFormData({ ...formData, personalityType: p })} style={{
                                        padding: '15px 20px', borderRadius: '14px',
                                        border: formData.personalityType === p ? '1.5px solid var(--terra)' : '1px solid var(--cream-dark)',
                                        background: formData.personalityType === p ? 'rgba(196,97,58,0.05)' : 'var(--cream)',
                                        cursor: 'pointer', fontSize: '1rem', textAlign: 'left', fontWeight: formData.personalityType === p ? 500 : 300,
                                        color: 'var(--ink)', transition: 'all 0.2s', fontFamily: 'inherit',
                                    }}>{p === user?.travelPersonality ? `✦ ${p} (Your Match)` : p}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>When and How Much?</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Start Date</label>
                                    <input type="date" min={new Date().toISOString().split('T')[0]} style={inputStyle} value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>End Date</label>
                                    <input type="date" min={formData.startDate || new Date().toISOString().split('T')[0]} style={inputStyle} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Total Budget</label>
                                    <input type="number" placeholder="e.g. 2000" style={inputStyle} value={formData.budgetTotal} onChange={e => setFormData({ ...formData, budgetTotal: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Currency</label>
                                    <select style={inputStyle} value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                                        <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>Where are you going?</h2>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Destination / City</label>
                                <input type="text" placeholder="e.g. Tokyo, Japan" style={inputStyle} value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Trip Name (Optional)</label>
                                <input type="text" placeholder="e.g. Summer Backpacking" style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'float 3s ease infinite' }}>✈️</div>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.6rem', marginBottom: '0.8rem' }}>Ready to generate!</h2>
                            <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontWeight: 300, lineHeight: 1.7 }}>
                                We'll craft a personalized {formData.type} itinerary in <strong style={{ color: 'var(--terra)' }}>{formData.destination}</strong> for the {formData.personalityType} persona.
                            </p>
                            <div style={{ background: 'var(--cream)', padding: '1.5rem', borderRadius: '16px', textAlign: 'left', marginBottom: '1rem', border: '1px solid var(--cream-dark)' }}>
                                <p style={{ marginBottom: '0.5rem', fontWeight: 300 }}><strong style={{ fontWeight: 500 }}>Dates:</strong> {formData.startDate} → {formData.endDate}</p>
                                <p style={{ fontWeight: 300 }}><strong style={{ fontWeight: 500 }}>Budget:</strong> {formData.budgetTotal} {formData.currency}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--cream-dark)' }}>
                        <button onClick={prevStep} disabled={step === 0} style={{ padding: '10px 20px', background: 'transparent', color: step === 0 ? 'transparent' : 'var(--ink-muted)', border: 'none', cursor: step === 0 ? 'default' : 'pointer', fontWeight: 400, fontSize: '0.95rem' }}>Back</button>
                        {step < 4 ? (
                            <button onClick={nextStep} style={{ padding: '0.75rem 2rem', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem', boxShadow: '0 4px 16px rgba(196,97,58,0.25)', transition: 'background 0.2s, transform 0.15s', letterSpacing: '0.02em' }}
                                onMouseEnter={e => { e.target.style.background = '#B05530'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'none'; }}
                            >Next Step →</button>
                        ) : (
                            <button onClick={handleFinish} style={{ padding: '0.75rem 2rem', background: 'var(--ink)', color: 'var(--cream)', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem', transition: 'background 0.2s, transform 0.15s' }}
                                onMouseEnter={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.target.style.background = 'var(--ink)'; e.target.style.transform = 'none'; }}
                            >Create & Generate ✦</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripBuilder;
