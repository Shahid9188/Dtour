import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
    const [filter, setFilter] = useState('all');

    const destinations = [
        { id: 1, name: 'Kyoto, Japan', category: 'cultural', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', tags: ['Temples', 'Nature', 'Food'] },
        { id: 2, name: 'Santorini, Greece', category: 'relaxation', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop', tags: ['Beaches', 'Views', 'Couples'] },
        { id: 3, name: 'Patagonia, Chile', category: 'adventure', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800&auto=format&fit=crop', tags: ['Hiking', 'Mountains', 'Wildlife'] },
        { id: 4, name: 'Rome, Italy', category: 'cultural', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop', tags: ['History', 'Food', 'Art'] },
        { id: 5, name: 'Bali, Indonesia', category: 'relaxation', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop', tags: ['Beaches', 'Yoga', 'Culture'] },
        { id: 6, name: 'Banff, Canada', category: 'adventure', image: 'https://images.unsplash.com/photo-1561134643-66c39f1c8107?q=80&w=800&auto=format&fit=crop', tags: ['Lakes', 'Skiing', 'Outdoors'] },
    ];

    const filteredDestinations = filter === 'all' ? destinations : destinations.filter(d => d.category === filter);

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '1rem' }}>
                    Find your next <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>escape</em>
                </h1>
                <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', fontWeight: 300, lineHeight: 1.6 }}>
                    Explore hand-picked destinations curated for every type of travel persona. Where will DTOUR take you next?
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {['all', 'cultural', 'adventure', 'relaxation'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '10px 24px',
                            background: filter === f ? 'var(--ink)' : 'var(--warm-white)',
                            color: filter === f ? 'var(--cream)' : 'var(--ink-muted)',
                            border: filter === f ? 'none' : '1px solid var(--cream-dark)',
                            borderRadius: '100px',
                            textTransform: 'capitalize',
                            fontWeight: filter === f ? 500 : 300,
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            letterSpacing: '0.02em',
                            transition: 'all 0.2s',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredDestinations.map((dest) => (
                    <div key={dest.id} style={{ 
                        background: 'var(--warm-white)', 
                        borderRadius: '24px', 
                        overflow: 'hidden', 
                        border: '1px solid var(--cream-dark)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(28,26,22,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{ width: '100%', height: '240px', overflow: 'hidden' }}>
                            <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                        </div>
                        <div style={{ padding: '1.8rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>{dest.name}</h3>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {dest.tags.map(tag => (
                                    <span key={tag} style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <Link to="/trips/new" style={{ 
                                display: 'inline-block', 
                                padding: '10px 0', 
                                color: 'var(--terra)', 
                                fontWeight: 500, 
                                fontSize: '0.95rem',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                Plan a trip here <span>→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
