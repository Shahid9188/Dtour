import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TripCard = ({ trip, onDelete }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const getEmoji = (dest) => {
        const map = { 'paris': '🗼', 'tokyo': '🗾', 'beach': '🏖️', 'mountain': '🏔️', 'italy': '🍕', 'lisbon': '🇵🇹', 'bali': '🌺' };
        for (let key in map) { if (dest.toLowerCase().includes(key)) return map[key]; }
        return '✈️';
    };

    const statusColors = { planning: { bg: 'rgba(196,97,58,0.08)', color: 'var(--terra)' }, upcoming: { bg: 'rgba(122,155,118,0.1)', color: '#5A7A56' }, completed: { bg: 'rgba(138,103,122,0.1)', color: '#6A4A5A' } };
    const sc = statusColors[trip.status] || statusColors.planning;

    return (
        <div
            onClick={() => navigate(`/trips/${trip._id}`)}
            style={{
                background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '20px',
                padding: '1.8rem', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s',
                transform: hovered ? 'translateY(-5px)' : 'none',
                boxShadow: hovered ? '0 16px 40px rgba(196,97,58,0.1)' : 'none',
                borderColor: hovered ? 'var(--terra-light)' : 'var(--cream-dark)',
                display: 'flex', flexDirection: 'column', gap: '0.8rem',
                cursor: 'pointer'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 20px 0 80px', background: 'var(--terra-light)', opacity: 0.2 }} />
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.25rem 0.7rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 500, background: sc.bg, color: sc.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{trip.status}</div>

            <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>{getEmoji(trip.destination)}</div>

            <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 600 }}>{trip.title}</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 300 }}>{trip.destination} · {trip.duration} days</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.78rem' }}>
                <span style={{ background: 'rgba(196,97,58,0.06)', padding: '4px 10px', borderRadius: '100px', color: 'var(--terra)', fontWeight: 400 }}>{trip.type === 'group' ? '👥 Group' : '👤 Solo'}</span>
                <span style={{ background: 'rgba(122,155,118,0.08)', padding: '4px 10px', borderRadius: '100px', color: 'var(--sage)', fontWeight: 400 }}>{new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</span>
                {trip.budget?.total && <span style={{ background: 'rgba(212,184,150,0.15)', padding: '4px 10px', borderRadius: '100px', color: '#8A6A40', fontWeight: 400 }}>{trip.budget.total} {trip.budget.currency}</span>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--cream-dark)' }}>
                <span style={{ fontWeight: 500, color: 'var(--terra)', fontSize: '0.9rem' }}>View Trip →</span>
                <button onClick={(e) => { e.stopPropagation(); onDelete(trip._id); }} style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', fontSize: '1rem', padding: '4px', transition: 'color 0.2s', position: 'relative', zIndex: 10 }}
                    onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                    onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}
                >🗑️</button>
            </div>
        </div>
    );
};

export default TripCard;
