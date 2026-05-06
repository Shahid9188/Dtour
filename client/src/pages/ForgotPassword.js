import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const inputStyle = {
    width: '100%', padding: '12px 16px', marginBottom: '1rem', border: '1.5px solid var(--cream-dark)',
    borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', background: 'var(--cream)', color: 'var(--ink)', boxSizing: 'border-box'
};

const buttonStyle = {
    width: '100%', padding: '14px', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none',
    borderRadius: '100px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', marginTop: '0.5rem',
    boxShadow: '0 4px 20px rgba(196,97,58,0.28)', transition: 'background 0.2s, transform 0.15s', letterSpacing: '0.03em', boxSizing: 'border-box'
};

const secondaryButtonStyle = {
    ...buttonStyle, background: 'transparent', border: '1px solid var(--cream-dark)', color: 'var(--ink-soft)',
    boxShadow: 'none', fontSize: '0.9rem', padding: '12px',
};

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const otpRefs = useRef([]);
    const navigate = useNavigate();
    const [storedOtp, setStoredOtp] = useState('');

    useEffect(() => {
        if (countdown > 0) { const timer = setTimeout(() => setCountdown(c => c - 1), 1000); return () => clearTimeout(timer); }
        else if (step === 2 && countdown === 0) { setCanResend(true); }
    }, [countdown, step]);

    const handleRequestOtp = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const res = await authAPI.forgotPassword({ email });
            if (res._demoOtp) { setStoredOtp(res._demoOtp); toast(`📧 Your OTP: ${res._demoOtp}`, { duration: 15000, style: { background: 'var(--terra)', color: 'var(--warm-white)', fontWeight: 500, fontSize: '1rem', padding: '14px 20px', borderRadius: '12px' }, icon: '🔐' }); }
            setStep(2); setCountdown(120); setCanResend(false); toast.success('OTP sent!');
        } catch (err) { setError(err.response?.data?.message || 'Failed to send OTP'); }
        setLoading(false);
    };

    const handleOtpChange = (index, value) => { if (value.length > 1) return; const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp); if (value && index < 5) otpRefs.current[index + 1]?.focus(); };
    const handleOtpKeyDown = (index, e) => { if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus(); };
    const handleOtpPaste = (e) => { e.preventDefault(); const pastedData = e.clipboardData.getData('text').slice(0, 6); if (/^\d+$/.test(pastedData)) { const digits = pastedData.split(''); const newOtp = [...otp]; digits.forEach((digit, i) => { if (i < 6) newOtp[i] = digit; }); setOtp(newOtp); otpRefs.current[Math.min(digits.length, 5)]?.focus(); } };

    const handleVerifyOtp = async (e) => {
        e.preventDefault(); const otpString = otp.join('');
        if (otpString.length !== 6) { setError('Please enter the complete 6-digit OTP'); return; }
        setError(''); setLoading(true);
        try { await authAPI.verifyOtp({ email, otp: otpString }); setStep(3); toast.success('OTP verified!'); }
        catch (err) { setError(err.response?.data?.message || 'Invalid OTP'); }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
        setError(''); setLoading(true);
        try { const otpString = otp.join(''); await authAPI.resetPassword({ email, otp: otpString, newPassword }); setSuccess('Password reset successfully!'); toast.success('Password reset! Redirecting...'); setTimeout(() => navigate('/login'), 2000); }
        catch (err) { setError(err.response?.data?.message || 'Failed to reset password'); }
        setLoading(false);
    };

    const handleResend = async () => {
        setCanResend(false); setOtp(['', '', '', '', '', '']); setError(''); setLoading(true);
        try {
            const res = await authAPI.forgotPassword({ email });
            if (res._demoOtp) { setStoredOtp(res._demoOtp); toast(`📧 New OTP: ${res._demoOtp}`, { duration: 15000, style: { background: 'var(--terra)', color: 'var(--warm-white)', fontWeight: 500, padding: '14px 20px', borderRadius: '12px' }, icon: '🔐' }); }
            setCountdown(120); toast.success('New OTP sent!');
        } catch (err) { setError(err.response?.data?.message || 'Failed to resend OTP'); setCanResend(true); }
        setLoading(false);
    };

    const formatCountdown = (secs) => { const m = Math.floor(secs / 60); const s = secs % 60; return `${m}:${s.toString().padStart(2, '0')}`; };
    const stepLabels = ['Email', 'Verify', 'Reset'];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem', paddingTop: '100px' }}>
            <div style={{ background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '24px', padding: '3rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px rgba(28,26,22,0.06)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(196,97,58,0.08), transparent 70%)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--terra)' }} />
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.04em' }}>DTOUR</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, margin: 0, color: 'var(--ink)' }}>
                        {step === 1 && 'Forgot Password?'}{step === 2 && 'Enter OTP'}{step === 3 && 'Set New Password'}
                    </h2>
                    <p style={{ color: 'var(--ink-muted)', marginTop: '0.5rem', fontSize: '0.88rem', fontWeight: 300 }}>
                        {step === 1 && "Enter your email and we'll send you a code."}{step === 2 && `We sent a 6-digit code to ${email}`}{step === 3 && 'Create a strong new password.'}
                    </p>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', gap: 0 }}>
                    {stepLabels.map((label, i) => {
                        const stepNum = i + 1; const isActive = step >= stepNum; const isCurrent = step === stepNum;
                        return (
                            <React.Fragment key={i}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s', background: isActive ? 'var(--terra)' : 'transparent', color: isActive ? 'var(--warm-white)' : 'var(--ink-muted)', border: isActive ? 'none' : '1.5px solid var(--cream-dark)', transform: isCurrent ? 'scale(1.1)' : 'scale(1)', boxShadow: isCurrent ? '0 4px 14px rgba(196,97,58,0.3)' : 'none', fontFamily: 'var(--font-serif)' }}>
                                        {step > stepNum ? '✓' : stepNum}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: isCurrent ? 500 : 300, color: isActive ? 'var(--ink)' : 'var(--ink-muted)' }}>{label}</span>
                                </div>
                                {i < 2 && <div style={{ flex: 1, height: '2px', margin: '0 8px', marginBottom: '20px', borderRadius: '2px', background: step > stepNum ? 'var(--terra)' : 'var(--cream-dark)', transition: 'all 0.4s', maxWidth: '80px' }} />}
                            </React.Fragment>
                        );
                    })}
                </div>

                {error && <div style={{ color: '#C4613A', background: 'rgba(196,97,58,0.06)', padding: '10px 14px', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.88rem', border: '1px solid rgba(196,97,58,0.12)' }}>{error}</div>}
                {success && <div style={{ color: 'var(--sage)', background: 'rgba(122,155,118,0.08)', padding: '10px 14px', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.88rem', border: '1px solid rgba(122,155,118,0.15)' }}>✓ {success}</div>}

                {/* Step 1 */}
                {step === 1 && (
                    <form onSubmit={handleRequestOtp}>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-80%)', fontSize: '1rem', opacity: 0.4 }}>📧</span>
                            <input style={{ ...inputStyle, paddingLeft: '42px' }} type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                        </div>
                        <button style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP →'}</button>
                    </form>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            {otp.map((digit, i) => (
                                <input key={i} ref={el => otpRefs.current[i] = el} style={{
                                    width: '46px', height: '54px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 600,
                                    border: digit ? '1.5px solid var(--terra)' : '1.5px solid var(--cream-dark)',
                                    borderRadius: '12px', outline: 'none', background: digit ? 'rgba(196,97,58,0.04)' : 'var(--cream)',
                                    color: 'var(--ink)', transition: 'all 0.2s', fontFamily: 'var(--font-serif)', caretColor: 'var(--terra)'
                                }} type="text" inputMode="numeric" maxLength={1} value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value.replace(/[^0-9]/g, ''))}
                                    onKeyDown={e => handleOtpKeyDown(i, e)} onPaste={i === 0 ? handleOtpPaste : undefined} autoFocus={i === 0} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            {countdown > 0 ? (
                                <span style={{ color: 'var(--ink-muted)', fontSize: '0.88rem', fontWeight: 300 }}>⏱️ Resend in <strong style={{ color: 'var(--terra)', fontWeight: 500 }}>{formatCountdown(countdown)}</strong></span>
                            ) : (
                                <button type="button" onClick={handleResend} disabled={!canResend || loading} style={{ background: 'none', border: 'none', color: 'var(--terra)', cursor: canResend ? 'pointer' : 'not-allowed', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'inherit', textDecoration: 'underline', opacity: canResend ? 1 : 0.5 }}>🔄 Resend OTP</button>
                            )}
                        </div>
                        <button style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP →'}</button>
                        <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); setCountdown(0); }} style={{ ...secondaryButtonStyle, marginTop: '0.75rem' }}>← Change Email</button>
                    </form>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-80%)', fontSize: '1rem', opacity: 0.4 }}>🔒</span>
                            <input style={{ ...inputStyle, paddingLeft: '42px' }} type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} autoFocus /></div>
                        <div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-80%)', fontSize: '1rem', opacity: 0.4 }}>🔒</span>
                            <input style={{ ...inputStyle, paddingLeft: '42px' }} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} /></div>
                        {newPassword && (
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                    {[1,2,3,4].map(level => (<div key={level} style={{ flex: 1, height: '3px', borderRadius: '2px', transition: 'all 0.3s', background: newPassword.length >= level * 3 ? level <= 1 ? '#C4613A' : level <= 2 ? '#D4B896' : level <= 3 ? '#7A9B76' : '#5A7A56' : 'var(--cream-dark)' }} />))}
                                </div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 300, color: newPassword.length < 6 ? '#C4613A' : newPassword.length < 8 ? '#D4B896' : newPassword.length < 12 ? '#7A9B76' : '#5A7A56' }}>
                                    {newPassword.length < 6 ? 'Too short' : newPassword.length < 8 ? 'Fair' : newPassword.length < 12 ? 'Good' : 'Strong'}
                                </span>
                            </div>
                        )}
                        <button style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'Resetting...' : '🔑 Reset Password'}</button>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--ink-muted)', fontSize: '0.88rem', fontWeight: 300 }}>
                    Remember your password? <Link to="/login" style={{ fontWeight: 500, color: 'var(--terra)' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
