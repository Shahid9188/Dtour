import React from 'react';
import { Link } from 'react-router-dom';

const Launch = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--ink)', 
            position: 'relative',
            overflow: 'hidden',
            color: 'var(--warm-white)',
            padding: '2rem'
        }}>
            {/* Ambient Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(196,97,58,0.15), transparent 70%)',
                borderRadius: '50%',
                animation: 'float 12s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(212,184,150,0.1), transparent 70%)',
                borderRadius: '50%',
                animation: 'float 15s ease-in-out infinite reverse',
                pointerEvents: 'none'
            }} />

            <div style={{
                maxWidth: '640px',
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Logo Area */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.6rem', 
                    marginBottom: '3rem',
                    animation: 'fadeUp 0.8s forwards'
                }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--terra)' }} />
                    <span style={{ 
                        fontFamily: 'var(--font-serif)', 
                        fontSize: '2rem', 
                        fontWeight: 600, 
                        color: 'var(--warm-white)', 
                        letterSpacing: '0.1em' 
                    }}>DTOUR</span>
                </div>

                <h1 style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: 'clamp(3rem, 8vw, 5rem)', 
                    fontWeight: 300, 
                    lineHeight: 1.1, 
                    marginBottom: '1.5rem',
                    animation: 'fadeUp 0.8s 0.2s forwards',
                    opacity: 0
                }}>
                    The future of <br/>
                    <em style={{ fontStyle: 'italic', color: 'var(--terra)', fontWeight: 400 }}>intelligent travel.</em>
                </h1>

                <p style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(249,246,239,0.6)', 
                    maxWidth: '500px', 
                    margin: '0 auto 4rem', 
                    fontWeight: 300, 
                    lineHeight: 1.8,
                    animation: 'fadeUp 0.8s 0.4s forwards',
                    opacity: 0
                }}>
                    Experience deeply personalized, AI-crafted journeys designed entirely around your travel personality.
                </p>

                <div style={{
                    animation: 'fadeUp 0.8s 0.6s forwards',
                    opacity: 0
                }}>
                    <Link 
                        to="/home"
                        style={{
                            display: 'inline-block',
                            padding: '16px 40px',
                            borderRadius: '100px',
                            background: 'var(--terra)',
                            color: 'var(--warm-white)',
                            textDecoration: 'none',
                            fontSize: '1.05rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 24px rgba(196,97,58,0.3)',
                        }}
                        onMouseEnter={e => {
                            e.target.style.background = '#B05530';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.background = 'var(--terra)';
                            e.target.style.transform = 'none';
                        }}
                    >
                        Enter Experience
                    </Link>
                </div>
                
                <div style={{
                    marginTop: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    opacity: 0,
                    animation: 'fadeUp 0.8s 0.8s forwards'
                }}>
                    <div style={{ color: 'rgba(249,246,239,0.4)', fontSize: '0.8rem', fontWeight: 300, letterSpacing: '0.05em' }}>© 2026 DTOUR</div>
                </div>
            </div>
        </div>
    );
};

export default Launch;
