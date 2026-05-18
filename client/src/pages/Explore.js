import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const destinations = [
        { id: 1, name: 'Kyoto, Japan', category: 'cultural', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', tags: ['Temples', 'Nature', 'Food'] },
        { id: 2, name: 'Santorini, Greece', category: 'relaxation', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop', tags: ['Beaches', 'Views', 'Couples'] },
        { id: 3, name: 'Patagonia, Chile', category: 'adventure', image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?q=80&w=800&auto=format&fit=crop', tags: ['Hiking', 'Mountains', 'Wildlife'] },
        { id: 4, name: 'Rome, Italy', category: 'cultural', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop', tags: ['History', 'Food', 'Art'] },
        { id: 5, name: 'Bali, Indonesia', category: 'relaxation', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop', tags: ['Beaches', 'Yoga', 'Culture'] },
        { id: 6, name: 'Banff, Canada', category: 'adventure', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop', tags: ['Lakes', 'Skiing', 'Outdoors'] },
        { id: 7, name: 'Jaipur, India', category: 'cultural', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop', tags: ['Palaces', 'Heritage', 'Crafts'] },
        { id: 8, name: 'Kerala, India', category: 'relaxation', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop', tags: ['Backwaters', 'Ayurveda', 'Nature'] },
        { id: 9, name: 'Ladakh, India', category: 'adventure', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop', tags: ['Mountains', 'Monasteries', 'Road Trips'] },
        { id: 10, name: 'Varanasi, India', category: 'cultural', image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800&auto=format&fit=crop', tags: ['Spirituality', 'Ghats', 'Ancient'] },
        { id: 11, name: 'Rishikesh, India', category: 'adventure', image: 'https://images.unsplash.com/photo-1607406374368-809f8ec7f118?q=80&w=800&auto=format&fit=crop', tags: ['Rafting', 'Yoga', 'Mountains'] },
        { id: 12, name: 'Shimla, India', category: 'relaxation', image: 'https://images.unsplash.com/photo-1609948543911-7f01ff385be5?q=80&w=800&auto=format&fit=crop', tags: ['Hill Station', 'Colonial', 'Snow'] },
        { id: 13, name: 'Manali, India', category: 'adventure', image: 'https://images.unsplash.com/photo-1597167231350-d057a45dc868?q=80&w=800&auto=format&fit=crop', tags: ['Trekking', 'Snow', 'Valleys'] },
        { id: 14, name: 'Amritsar, India', category: 'cultural', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=800&auto=format&fit=crop', tags: ['Golden Temple', 'Food', 'Heritage'] },
        { id: 15, name: 'Dharamshala, India', category: 'relaxation', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop', tags: ['Tibetan Culture', 'Meditation', 'Mountains'] },
        { id: 16, name: 'Spiti Valley, India', category: 'adventure', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=800&auto=format&fit=crop', tags: ['Remote', 'Passes', 'Stargazing'] },
        { id: 17, name: 'Bishkek & Issyk-Kul, Kyrgyzstan', category: 'adventure', image: 'https://images.unsplash.com/photo-1742912527667-001d4c1390bb?q=80&w=800&auto=format&fit=crop', tags: ['Nomadic', 'Mountains', 'Lakes'] },
        { id: 18, name: 'Marrakech, Morocco', category: 'cultural', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=800&auto=format&fit=crop', tags: ['Souks', 'Riads', 'Spices'] },
        { id: 19, name: 'Iceland', category: 'adventure', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?q=80&w=800&auto=format&fit=crop', tags: ['Northern Lights', 'Glaciers', 'Geysers'] },
        { id: 20, name: 'Hoi An, Vietnam', category: 'cultural', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop', tags: ['Lanterns', 'Street Food', 'History'] },
        { id: 21, name: 'Cusco & Machu Picchu, Peru', category: 'adventure', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop', tags: ['Inca Trail', 'Ruins', 'Altitude'] },
        { id: 22, name: 'Queenstown, New Zealand', category: 'adventure', image: 'https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?q=80&w=800&auto=format&fit=crop', tags: ['Bungee', 'Fjords', 'Skiing'] },
        { id: 23, name: 'Cappadocia, Turkey', category: 'relaxation', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop', tags: ['Hot Air Balloons', 'Caves', 'Sunsets'] },
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
                            <button onClick={() => navigate('/trips/new', { state: { destination: dest.name, title: `Trip to ${dest.name}` } })} style={{ 
                                background: 'none',
                                border: 'none',
                                padding: '10px 0', 
                                color: 'var(--terra)', 
                                fontWeight: 500, 
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontFamily: 'inherit'
                            }}>
                                Plan a trip here <span>→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
