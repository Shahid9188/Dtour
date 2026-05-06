import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { Link, useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard/TripCard';

const Dashboard = () => {
    const { user } = useAuth();
    const { trips, fetchTrips, deleteTrip, isLoading } = useTrip();
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            await deleteTrip(id);
        }
    };

    const filteredTrips = trips.filter(trip => {
        if (filter === 'all') return true;
        if (filter === 'solo' || filter === 'group') return trip.type === filter;
        return trip.status === filter;
    });

    const statBoxes = [
        { label: 'Total Trips', value: trips.length, icon: '✈️', accent: 'var(--terra)' },
        { label: 'Upcoming', value: trips.filter(t => t.status !== 'completed').length, icon: '📅', accent: 'var(--sage)' },
        { label: 'Group Trips', value: trips.filter(t => t.type === 'group').length, icon: '👥', accent: 'var(--sand)' },
        { label: 'Countries visited', value: [...new Set(trips.filter(t => t.status === 'completed').map(t => t.destination))].length, icon: '🌍', accent: '#8A6A8A' },
    ];

    if (isLoading && trips.length === 0) {
        return <div style={{ paddingTop: '100px', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink-muted)' }}>Loading dashboard...</div>;
    }

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                        Welcome back, <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>{user?.name?.split(' ')[0]}</em>
                    </h1>
                    {user?.travelPersonality ? (
                        <div style={{ display: 'inline-block', background: 'rgba(196,97,58,0.08)', color: 'var(--terra)', padding: '6px 16px', borderRadius: '100px', fontWeight: 500, fontSize: '0.85rem' }}>
                            {user.travelPersonality} Persona
                        </div>
                    ) : (
                        <Link to="/quiz" style={{ color: 'var(--terra)', fontWeight: 500, fontSize: '0.9rem' }}>Take the personality quiz →</Link>
                    )}
                </div>
                <button
                    onClick={() => navigate('/trips/new')}
                    style={{ padding: '0.75rem 1.8rem', background: 'var(--ink)', color: 'var(--cream)', borderRadius: '100px', border: 'none', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.03em', transition: 'background 0.2s, transform 0.15s' }}
                    onMouseEnter={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.target.style.background = 'var(--ink)'; e.target.style.transform = 'none'; }}
                >
                    + New Trip
                </button>
            </div>

            {/* Quiz banner */}
            {(!user?.travelPersonality) && (
                <div style={{ background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', padding: '1.5rem 2rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 5px 0', color: 'var(--terra)', fontWeight: 600, fontSize: '1.15rem' }}>Unlock AI Personalization</h3>
                        <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 300 }}>Take our 7-question quiz so DTOUR can understand your travel style.</p>
                    </div>
                    <button
                        onClick={() => navigate('/quiz')}
                        style={{ padding: '0.6rem 1.4rem', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '100px', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 16px rgba(196,97,58,0.2)' }}
                    >
                        Take Quiz
                    </button>
                </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
                {statBoxes.map((stat, i) => (
                    <div key={i} style={{ background: 'var(--warm-white)', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--cream-dark)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,26,22,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{ fontSize: '1.8rem', width: '48px', height: '48px', borderRadius: '14px', background: `${stat.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 300 }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
                {['all', 'planning', 'upcoming', 'completed', 'solo', 'group'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 18px',
                            background: filter === f ? 'var(--ink)' : 'var(--warm-white)',
                            color: filter === f ? 'var(--cream)' : 'var(--ink-muted)',
                            border: filter === f ? 'none' : '1px solid var(--cream-dark)',
                            borderRadius: '100px',
                            textTransform: 'capitalize',
                            fontWeight: filter === f ? 500 : 300,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            letterSpacing: '0.02em',
                            transition: 'all 0.2s',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredTrips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--warm-white)', borderRadius: '24px', border: '1px dashed var(--cream-dark)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🏜️</div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)', marginBottom: '0.5rem', fontWeight: 400, fontSize: '1.4rem' }}>No trips found</h3>
                    <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontWeight: 300, fontSize: '0.9rem' }}>You don't have any trips matching this filter.</p>
                    <button
                        onClick={() => navigate('/trips/new')}
                        style={{ padding: '0.8rem 2rem', background: 'var(--terra)', color: 'var(--warm-white)', borderRadius: '100px', border: 'none', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 20px rgba(196,97,58,0.28)' }}
                    >
                        Start Planning
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredTrips.map(trip => (
                        <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
