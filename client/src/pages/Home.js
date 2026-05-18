import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const personas = [
        { emoji: '🌅', type: 'The Slow Wanderer', desc: 'You savour mornings with local coffee and unplanned afternoons. Depth over distance.', tag: 'Immersive', tagClass: { background: 'rgba(196,97,58,0.1)', color: 'var(--terra)' }, corner: 'var(--terra-light)' },
        { emoji: '🌿', type: 'The Nature Seeker', desc: 'Mountains, trails, and open sky. You recharge when surrounded by the natural world.', tag: 'Outdoors', tagClass: { background: 'rgba(122,155,118,0.12)', color: 'var(--sage)' }, corner: 'var(--sage-light)' },
        { emoji: '🍜', type: 'The Culture Collector', desc: 'Every market, museum, and meal tells a story. You travel to understand, not just to see.', tag: 'Cultural', tagClass: { background: 'rgba(212,184,150,0.25)', color: 'var(--sand)' }, corner: 'var(--sand)' },
        { emoji: '🏄', type: 'The Rush Chaser', desc: "Adventure first, itinerary later. You're happiest when the plan is loose and the pace is fast.", tag: 'Adventure', tagClass: { background: 'rgba(184,207,222,0.3)', color: '#5A9ABF' }, corner: '#B8CFDE' },
        { emoji: '✨', type: 'The Luxe Romantic', desc: 'Curated stays, candlelit dinners, and experiences worth remembering forever.', tag: 'Refined', tagClass: { background: 'rgba(213,197,224,0.3)', color: '#8A6AAA' }, corner: '#D5C5E0' },
    ];

    const features = [
        { icon: '🧠', title: 'Personality Mapping', text: 'We go beyond preferences — understanding your rhythm, comfort zone, and curiosity level.' },
        { icon: '🗓️', title: 'Smart Itineraries', text: 'Hyper-personalised day plans that balance must-sees with hidden local spots.' },
        { icon: '👥', title: 'Group Harmony', text: 'Blend multiple travel personas into one trip everyone genuinely loves.' },
        { icon: '💸', title: 'Expense Tracking', text: 'Split costs effortlessly. No awkward chats about money on your holiday.' },
        { icon: '⚡', title: 'On-the-fly Planning', text: 'Plans changed? DTOUR adapts instantly — rain, delays, or a change of heart.' },
        { icon: '📍', title: 'Local Intelligence', text: 'Real recommendations curated for your persona, not recycled tourist lists.' },
    ];

    return (
        <div>
            {/* ── HERO ── */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '8rem 3.5rem 4rem', overflow: 'hidden' }}>
                {/* Blobs */}
                <div style={{ position: 'absolute', width: '520px', height: '480px', borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', background: 'radial-gradient(ellipse, rgba(196,97,58,0.12), transparent 70%)', top: '8%', right: '-6%', animation: 'float 9s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', width: '380px', height: '420px', borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', background: 'radial-gradient(ellipse, rgba(122,155,118,0.13), transparent 70%)', bottom: '5%', left: '-4%', animation: 'float 9s ease-in-out infinite', animationDelay: '-4s', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', width: '280px', height: '260px', borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%', background: 'radial-gradient(ellipse, rgba(212,184,150,0.2), transparent 70%)', top: '30%', left: '10%', animation: 'float 9s ease-in-out infinite', animationDelay: '-7s', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '780px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: 'var(--terra)', marginBottom: '1.5rem', letterSpacing: '0.02em', opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards' }}>
                        <span style={{ width: '28px', height: '1px', background: 'var(--terra)', opacity: 0.6 }} />
                        your ai travel companion
                        <span style={{ width: '28px', height: '1px', background: 'var(--terra)', opacity: 0.6 }} />
                    </span>

                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 7vw, 5.2rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: '1.6rem', opacity: 0, animation: 'fadeUp 0.8s 0.4s forwards' }}>
                        Travel that feels<br />
                        <em style={{ fontStyle: 'italic', color: 'var(--terra)', fontWeight: 400 }}>honestly, deeply</em>
                        <strong style={{ display: 'block', fontWeight: 600 }}>you.</strong>
                    </h1>

                    <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', maxWidth: '520px', margin: '0 auto 2.8rem', fontWeight: 300, lineHeight: 1.8, opacity: 0, animation: 'fadeUp 0.8s 0.6s forwards' }}>
                        DTOUR reads your personality, not just your preferences — and crafts journeys that feel like they were made for exactly who you are.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', opacity: 0, animation: 'fadeUp 0.8s 0.8s forwards' }}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" style={{ background: 'var(--terra)', color: 'var(--warm-white)', fontSize: '0.9rem', fontWeight: 500, padding: '0.9rem 2.2rem', borderRadius: '100px', border: 'none', letterSpacing: '0.03em', boxShadow: 'var(--shadow-terra)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s', textDecoration: 'none' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--terra-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--terra)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    Go to Dashboard
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </Link>
                                <Link to="/trips/new" style={{ background: 'transparent', color: 'var(--ink-soft)', fontSize: '0.9rem', fontWeight: 400, padding: '0.9rem 2rem', borderRadius: '100px', border: '1px solid var(--cream-dark)', letterSpacing: '0.02em', transition: 'border-color 0.2s, color 0.2s, transform 0.15s', textDecoration: 'none' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--terra)'; e.currentTarget.style.color = 'var(--terra)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-dark)'; e.currentTarget.style.color = 'var(--ink-soft)'; }}
                                >
                                    Plan a new trip
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" style={{ background: 'var(--terra)', color: 'var(--warm-white)', fontSize: '0.9rem', fontWeight: 500, padding: '0.9rem 2.2rem', borderRadius: '100px', border: 'none', letterSpacing: '0.03em', boxShadow: 'var(--shadow-terra)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s', textDecoration: 'none' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--terra-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--terra)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    Start your journey
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </Link>
                                <Link to="/login" style={{ background: 'transparent', color: 'var(--ink-soft)', fontSize: '0.9rem', fontWeight: 400, padding: '0.9rem 2rem', borderRadius: '100px', border: '1px solid var(--cream-dark)', letterSpacing: '0.02em', transition: 'border-color 0.2s, color 0.2s, transform 0.15s', textDecoration: 'none' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--terra)'; e.currentTarget.style.color = 'var(--terra)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-dark)'; e.currentTarget.style.color = 'var(--ink-soft)'; }}
                                >
                                    Already have an account?
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', opacity: 0, animation: 'fadeUp 0.8s 1s forwards' }}>
                        {[{ num: '8', label: 'Travel Personas' }, null, { num: '98%', label: 'Feel Understood' }].map((item, i) =>
                            item ? (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, color: 'var(--ink)', display: 'block' }}>{item.num}</span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 400 }}>{item.label}</span>
                                </div>
                            ) : (
                                <div key={i} style={{ width: '1px', height: '40px', background: 'var(--cream-dark)' }} />
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* ── PERSONAS ── */}
            <section style={{ padding: '6rem 3.5rem', background: 'var(--warm-white)', overflow: 'hidden' }}>
                <p style={{ textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'var(--terra)', marginBottom: '0.6rem' }}>who are you, really?</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, textAlign: 'center', color: 'var(--ink)', marginBottom: '0.8rem', lineHeight: 1.25 }}>Discover your travel persona</h2>
                <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--ink-muted)', fontWeight: 300, maxWidth: '440px', margin: '0 auto 3.5rem', lineHeight: 1.7 }}>Not just a traveller type — a full picture of how you experience the world.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', maxWidth: '1100px', margin: '0 auto' }}>
                    {personas.map((p, i) => (
                        <div key={i} style={{ background: 'var(--cream)', borderRadius: '20px', padding: '2rem 1.6rem', position: 'relative', cursor: 'pointer', border: '1px solid transparent', transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s', overflow: 'hidden' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--terra-light)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 20px 0 80px', background: p.corner, opacity: 0.35 }} />
                            <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', lineHeight: 1 }}>{p.emoji}</span>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>{p.type}</p>
                            <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)', fontWeight: 300, lineHeight: 1.65 }}>{p.desc}</p>
                            <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', padding: '0.3rem 0.8rem', borderRadius: '100px', fontWeight: 500, letterSpacing: '0.02em', ...p.tagClass }}>{p.tag}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '6rem 3.5rem', background: 'var(--cream)' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <p style={{ textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'var(--terra)', marginBottom: '0.6rem' }}>simple as it gets</p>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, textAlign: 'center', color: 'var(--ink)', marginBottom: '0.8rem', lineHeight: 1.25 }}>
                        Three steps to your <em style={{ fontStyle: 'italic' }}>perfect trip</em>
                    </h2>
                    <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--ink-muted)', fontWeight: 300, maxWidth: '440px', margin: '0 auto 3.5rem', lineHeight: 1.7 }}>No endless forms. Just a conversation that gets to know you.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, position: 'relative', marginTop: '3.5rem' }}>
                        <div style={{ position: 'absolute', top: '2rem', left: 'calc(16.6% + 1rem)', right: 'calc(16.6% + 1rem)', height: '1px', background: 'var(--gradient-terra-sage)' }} />
                        {[
                            { num: '01', title: 'Tell us about yourself', text: 'Answer a few thoughtful questions. We map your travel personality, not just your destination.' },
                            { num: '02', title: 'We craft your journey', text: 'AI-generated itineraries shaped around who you are — adjusted in real time as you explore.' },
                            { num: '03', title: 'Travel, your way', text: 'Share with your group, track expenses together, and make changes on the fly — zero friction.' },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '0 1.5rem' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', margin: '0 auto 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--terra)', position: 'relative', zIndex: 2, transition: 'all 0.2s' }}>{s.num}</div>
                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>{s.title}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontWeight: 300, lineHeight: 1.7 }}>{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES (dark section) ── */}
            <section style={{ padding: '6rem 3.5rem', background: 'var(--feature-section-bg)', overflow: 'hidden' }}>
                <p style={{ textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: 'var(--terra-light)', marginBottom: '0.6rem' }}>what makes dtour different</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, textAlign: 'center', color: 'var(--feature-section-text)', marginBottom: '0.8rem', lineHeight: 1.25 }}>Built for real travellers</h2>
                <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--feature-section-muted)', fontWeight: 300, maxWidth: '440px', margin: '0 auto 3.5rem', lineHeight: 1.7 }}>Every feature designed around how people actually travel.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(249,246,239,0.07)', border: '1px solid rgba(249,246,239,0.07)', borderRadius: '16px', overflow: 'hidden', maxWidth: '960px', margin: '0 auto' }}>
                    {features.map((f, i) => (
                        <div key={i} style={{ padding: '2.2rem 2rem', background: 'transparent', transition: 'background 0.2s', cursor: 'default' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,97,58,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(196,97,58,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontSize: '1.1rem' }}>{f.icon}</div>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--feature-section-text)', marginBottom: '0.5rem' }}>{f.title}</p>
                            <p style={{ fontSize: '0.83rem', color: 'var(--feature-section-muted)', fontWeight: 300, lineHeight: 1.7 }}>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIAL ── */}
            <section style={{ padding: '6rem 3.5rem', background: 'var(--warm-white)', textAlign: 'center' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '6rem', lineHeight: 0.5, color: 'var(--terra-light)', display: 'block', marginBottom: '1.5rem' }}>"</span>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontStyle: 'italic', fontWeight: 300, color: 'var(--ink)', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
                    It felt like the itinerary was written by a friend who'd known me for years. Not an algorithm that read my search history.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--terra-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--terra)', fontWeight: 500 }}>SR</div>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink-soft)' }}>Sana R.</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontWeight: 300 }}>Slow Wanderer · Lisbon, 2024</p>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '6rem 3.5rem', background: 'var(--cream)', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--warm-white)', borderRadius: '28px', padding: '4rem 3rem', border: '1px solid var(--cream-dark)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(196,97,58,0.1), transparent 70%)', pointerEvents: 'none' }} />
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.8rem', lineHeight: 1.2 }}>
                        {isAuthenticated ? (<>Plan your next <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>adventure</em></>) : (<>Ready to travel <em style={{ fontStyle: 'italic', color: 'var(--terra)' }}>as yourself?</em></>)}
                    </h2>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', fontWeight: 300, marginBottom: '2.2rem', lineHeight: 1.7 }}>
                        {isAuthenticated
                            ? "You're all set — let DTOUR craft another journey tailored to your travel personality."
                            : "Join thousands of travellers who've discovered that the best journeys start with knowing who you are."
                        }
                    </p>
                    <Link to={isAuthenticated ? '/trips/new' : '/register'} style={{ background: 'var(--terra)', color: 'var(--warm-white)', fontSize: '0.95rem', fontWeight: 500, padding: '1rem 2.5rem', borderRadius: '100px', border: 'none', boxShadow: 'var(--shadow-terra)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background 0.2s, transform 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--terra-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--terra)'; e.currentTarget.style.transform = 'none'; }}
                    >
                        {isAuthenticated ? 'Plan a new trip' : 'Start your journey free'}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                    {!isAuthenticated && (
                        <p style={{ marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            ✦ Free to start · No credit card required
                        </p>
                    )}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ padding: '2.5rem 3.5rem', borderTop: '1px solid var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cream)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terra)' }} />
                    DTOUR
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {['About', 'Privacy', 'Terms', 'Contact'].map(link => (
                        <a key={link} href="#" style={{ textDecoration: 'none', fontSize: '0.8rem', color: 'var(--ink-muted)', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}
                        >{link}</a>
                    ))}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>© 2025 DTOUR</p>
            </footer>
        </div>
    );
};

export default Home;
