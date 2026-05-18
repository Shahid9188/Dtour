import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
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
        background: scrolled ? 'var(--nav-bg-scrolled)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border-scrolled)' : 'none',
        transition: 'all 0.3s ease',
    };

    const logoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.5rem',
        fontWeight: 600,
        color: 'var(--ink)',
        letterSpacing: '0.04em',
        textDecoration: 'none',
    };

    const dotStyle = {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--terra)',
        marginTop: '2px',
    };

    const linkStyle = {
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: 400,
        color: 'var(--ink-soft)',
        letterSpacing: '0.03em',
        transition: 'color 0.2s',
    };

    const btnNavStyle = {
        background: 'var(--ink)',
        color: 'var(--cream)',
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
        background: 'linear-gradient(135deg, var(--terra), var(--sand))',
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
        background: 'var(--warm-white)',
        border: '1px solid var(--cream-dark)',
        borderRadius: '16px',
        padding: '1.2rem',
        minWidth: '220px',
        display: menuOpen ? 'block' : 'none',
        boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
        zIndex: 1001,
    };

    const themeToggleStyle = {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1px solid var(--cream-dark)',
        background: 'var(--warm-white)',
        color: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        flexShrink: 0,
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
                            onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
                        >
                            Explore
                        </Link>
                        <Link
                            to="/dashboard"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/trips/new"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
                        >
                            New Trip
                        </Link>
                        <button
                            onClick={toggleTheme}
                            style={themeToggleStyle}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--terra)'; e.currentTarget.style.transform = 'rotate(20deg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-dark)'; e.currentTarget.style.transform = 'none'; }}
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <div style={avatarStyle} onClick={() => setMenuOpen(!menuOpen)}>
                            {user?.name?.charAt(0).toUpperCase()}

                            <div style={dropdownStyle}>
                                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--cream-dark)' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>{user?.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '2px' }}>{user?.email}</div>
                                    {user?.travelPersonality && (
                                        <div style={{
                                            display: 'inline-block',
                                            marginTop: '8px',
                                            fontSize: '0.75rem',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '100px',
                                            background: 'rgba(196,97,58,0.1)',
                                            color: 'var(--terra)',
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
                                        color: 'var(--ink-soft)',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        padding: '6px 0',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
                                >
                                    Profile Settings
                                </Link>
                                <div
                                    onClick={logout}
                                    style={{
                                        color: 'var(--terra)',
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
                            onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
                        >
                            Explore
                        </Link>
                        <Link
                            to="/login"
                            style={linkStyle}
                            onMouseEnter={e => e.target.style.color = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
                        >
                            Sign In
                        </Link>
                        <button
                            onClick={toggleTheme}
                            style={themeToggleStyle}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--terra)'; e.currentTarget.style.transform = 'rotate(20deg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-dark)'; e.currentTarget.style.transform = 'none'; }}
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <Link to="/register">
                            <button
                                style={btnNavStyle}
                                onMouseEnter={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.target.style.background = 'var(--ink)'; e.target.style.transform = 'none'; }}
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
