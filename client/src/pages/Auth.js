import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AuthShell = ({ title, subtitle, children }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem', paddingTop: '100px' }}>
            <div style={{
                background: 'var(--warm-white)',
                border: '1px solid var(--cream-dark)',
                borderRadius: '24px',
                padding: '3rem',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 25px 50px rgba(28,26,22,0.06)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(196,97,58,0.08), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--terra)' }} />
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.04em' }}>DTOUR</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>{title}</h2>
                    {subtitle && <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 300, marginTop: '0.4rem' }}>{subtitle}</p>}
                </div>
                {children}
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '1rem',
    border: '1.5px solid var(--cream-dark)',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: 'var(--cream)',
    color: 'var(--ink)',
    boxSizing: 'border-box',
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: 'var(--terra)',
    color: 'var(--warm-white)',
    border: 'none',
    borderRadius: '100px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 20px rgba(196,97,58,0.28)',
    transition: 'background 0.2s, transform 0.15s',
    letterSpacing: '0.03em',
};

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <AuthShell title="Welcome back" subtitle="Pick up right where you left off.">
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'var(--terra)', background: 'rgba(196,97,58,0.08)', padding: '10px 14px', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(196,97,58,0.15)' }}>{error}</div>}
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    onFocus={e => { e.target.style.borderColor = 'var(--terra)'; e.target.style.boxShadow = '0 0 0 3px rgba(196,97,58,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--cream-dark)'; e.target.style.boxShadow = 'none'; }}
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    onFocus={e => { e.target.style.borderColor = 'var(--terra)'; e.target.style.boxShadow = '0 0 0 3px rgba(196,97,58,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--cream-dark)'; e.target.style.boxShadow = 'none'; }}
                />
                <div style={{ textAlign: 'right', marginBottom: '0.5rem', marginTop: '-0.5rem' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--terra)', fontWeight: 400 }}>Forgot password?</Link>
                </div>
                <button
                    style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                    onMouseEnter={e => { if (!loading) { e.target.style.background = '#B05530'; e.target.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'none'; }}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 300 }}>
                Don't have an account? <Link to="/register" style={{ fontWeight: 500, color: 'var(--terra)' }}>Sign Up</Link>
            </p>
        </AuthShell>
    );
};

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localErr, setLocalErr] = useState('');
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setLocalErr('Passwords do not match');
            return;
        }
        setLocalErr('');
        setLoading(true);
        try {
            await register({ name, email, password });
            navigate('/quiz');
        } catch (err) {
            setLoading(false);
        }
    };

    const focusHandler = e => { e.target.style.borderColor = 'var(--terra)'; e.target.style.boxShadow = '0 0 0 3px rgba(196,97,58,0.1)'; };
    const blurHandler = e => { e.target.style.borderColor = 'var(--cream-dark)'; e.target.style.boxShadow = 'none'; };

    return (
        <AuthShell title="Create account" subtitle="Begin discovering your travel persona.">
            <form onSubmit={handleSubmit}>
                {(error || localErr) && <div style={{ color: 'var(--terra)', background: 'rgba(196,97,58,0.08)', padding: '10px 14px', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(196,97,58,0.15)' }}>{error || localErr}</div>}
                <input style={inputStyle} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required onFocus={focusHandler} onBlur={blurHandler} />
                <input style={inputStyle} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required onFocus={focusHandler} onBlur={blurHandler} />
                <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required onFocus={focusHandler} onBlur={blurHandler} />
                <input style={inputStyle} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required onFocus={focusHandler} onBlur={blurHandler} />
                <button
                    style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                    onMouseEnter={e => { if (!loading) { e.target.style.background = '#B05530'; e.target.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'none'; }}
                >
                    {loading ? 'Creating...' : 'Sign Up'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 300 }}>
                Already have an account? <Link to="/login" style={{ fontWeight: 500, color: 'var(--terra)' }}>Sign In</Link>
            </p>
        </AuthShell>
    );
};
