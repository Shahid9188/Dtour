import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scrolled ? '1rem 3.5rem' : '1.4rem 3.5rem',
        background: scrolled ? 'rgba(249,246,239,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(196,97,58,0.1)' : 'none',
        transition: 'all 0.3s ease',
    };

    const logoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1C1A16',
        letterSpacing: '0.04em',
        textDecoration: 'none',
    };

    const dotStyle = {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#C4613A',
        marginTop: '2px',
    };

    const linkStyle = {
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: 400,
        color: '#4A4540',
        letterSpacing: '0.03em',
        transition: 'color 0.2s',
    };

    const btnNavStyle = {
        background: '#1C1A16',
        color: '#F9F6EF',
        padding: '0.55rem 1.4rem',
        borderRadius: '100px',
        fontSize: '0.85rem',
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background 0.2s, transform 0.15s',
        letterSpacing: '0.03em',
    };

    const avatarStyle = {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C4613A, #D4B896)',
        color: '#FDFBF7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
        position: 'relative',
        fontFamily: "'Cormorant Garamond', serif",
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '50px',
        right: '0',
        background: '#FDFBF7',
        border: '1px solid #EDE8DC',
        borderRadius: '16px',
        padding: '1.2rem',
        minWidth: '220px',
        display: menuOpen ? 'block' : 'none',
        boxShadow: '0 16px 40px rgba(28,26,22,0.1)',
        zIndex: 1001,
    };

    return (
        <nav style={navStyle}>
            <Link to={isAuthenticated ? '/dashboard' : '/home'} style={logoStyle}>
                <div style={dotStyle}></div>
                DTOUR
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/explore"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = '#C4613A'}
                            onMouseLeave={e => e.target.style.color = '#4A4540'}
                        >
                            Explore
                        </Link>
                        <Link
                            to="/dashboard"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = '#C4613A'}
                            onMouseLeave={e => e.target.style.color = '#4A4540'}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/trips/new"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = '#C4613A'}
                            onMouseLeave={e => e.target.style.color = '#4A4540'}
                        >
                            New Trip
                        </Link>
                        <div style={avatarStyle} onClick={() => setMenuOpen(!menuOpen)}>
                            {user?.name?.charAt(0).toUpperCase()}

                            <div style={dropdownStyle}>
                                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #EDE8DC' }}>
                                    <div style={{ fontWeight: 600, color: '#1C1A16', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>{user?.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#8A837A', marginTop: '2px' }}>{user?.email}</div>
                                    {user?.travelPersonality && (
                                        <div style={{
                                            display: 'inline-block',
                                            marginTop: '8px',
                                            fontSize: '0.75rem',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '100px',
                                            background: 'rgba(196,97,58,0.1)',
                                            color: '#C4613A',
                                            fontWeight: 500,
                                        }}>
                                            {user.travelPersonality}
                                        </div>
                                    )}
                                </div>
                                <Link
                                    to="/profile"
                                    style={{
                                        display: 'block',
                                        color: '#4A4540',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        padding: '6px 0',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.color = '#C4613A'}
                                    onMouseLeave={e => e.target.style.color = '#4A4540'}
                                >
                                    Profile Settings
                                </Link>
                                <div
                                    onClick={logout}
                                    style={{
                                        color: '#C4613A',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        padding: '6px 0',
                                        transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.opacity = '0.7'}
                                    onMouseLeave={e => e.target.style.opacity = '1'}
                                >
                                    Sign out
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/explore"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = '#C4613A'}
                            onMouseLeave={e => e.target.style.color = '#4A4540'}
                        >
                            Explore
                        </Link>
                        <Link
                            to="/login"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = '#C4613A'}
                            onMouseLeave={e => e.target.style.color = '#4A4540'}
                        >
                            Sign In
                        </Link>
                        <Link to="/register">
                            <button
                                style={btnNavStyle}
                                onMouseEnter={e => { e.target.style.background = '#C4613A'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.target.style.background = '#1C1A16'; e.target.style.transform = 'none'; }}
                            >
                                Get Started
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
