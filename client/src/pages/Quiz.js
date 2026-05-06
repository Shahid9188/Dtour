import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const { updatePersonality } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQ = async () => {
            try {
                const res = await aiAPI.getQuizQuestions();
                setQuestions(res);
            } catch (err) {
                toast.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQ();
    }, []);

    const handleSelect = async (optText) => {
        const currentQ = questions[currentIndex];
        const newAnswer = { questionId: currentQ.id, questionText: currentQ.text, selectedValue: optText, answer: optText };

        setAnswers(prev => {
            const existing = prev.filter(a => a.questionId !== currentQ.id);
            return [...existing, newAnswer];
        });

        if (currentIndex < questions.length - 1) {
            setTimeout(() => setCurrentIndex(prev => prev + 1), 350);
        } else {
            setLoading(true);
            try {
                const finalAnswers = [...answers.filter(a => a.questionId !== currentQ.id), newAnswer];
                const res = await authAPI.submitQuiz({ answers: finalAnswers });
                updatePersonality({ personality: res.personality, answers: finalAnswers });
                setResult(res);
            } catch (err) {
                toast.error('Failed to submit quiz');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--terra)' }}>Loading...</div>;
    }

    if (result) {
        const { profile, personality } = result;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem', paddingTop: '100px' }}>
                <div style={{ background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '24px', padding: '3rem', width: '100%', maxWidth: '600px', textAlign: 'center', boxShadow: '0 25px 50px rgba(28,26,22,0.06)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(196,97,58,0.08), transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>{profile.emoji}</div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--terra)', marginBottom: '0.5rem', fontWeight: 600 }}>{personality}</h2>
                    <h4 style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.1rem' }}>"{profile.tagline}"</h4>
                    <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', color: 'var(--ink-soft)', fontWeight: 300 }}>{profile.description}</p>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        {profile.traits.map((t, i) => <span key={i} style={{ background: 'rgba(196,97,58,0.08)', color: 'var(--terra)', padding: '6px 14px', borderRadius: '100px', fontWeight: 500, fontSize: '0.85rem' }}>{t}</span>)}
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <h5 style={{ color: 'var(--ink-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', fontWeight: 400, fontFamily: 'var(--font-sans)' }}>Top Destinations For You</h5>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {profile.bestDestinations.map((d, i) => <span key={i} style={{ background: 'var(--cream)', border: '1px solid var(--cream-dark)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 300 }}>📍 {d}</span>)}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate('/trips/new')} style={{ flex: 2, padding: '14px', background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 20px rgba(196,97,58,0.28)', transition: 'background 0.2s, transform 0.15s' }}
                            onMouseEnter={e => { e.target.style.background = '#B05530'; e.target.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.target.style.background = 'var(--terra)'; e.target.style.transform = 'none'; }}
                        >Plan My Perfect Trip</button>
                        <button onClick={() => { setResult(null); setCurrentIndex(0); setAnswers([]); }} style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--cream-dark)', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 400, cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                            onMouseEnter={e => { e.target.style.borderColor = 'var(--terra)'; e.target.style.color = 'var(--terra)'; }}
                            onMouseLeave={e => { e.target.style.borderColor = 'var(--cream-dark)'; e.target.style.color = 'var(--ink-soft)'; }}
                        >Retake</button>
                    </div>
                </div>
            </div>
        );
    }

    const q = questions[currentIndex];
    if (!q) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem', paddingTop: '100px' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    {currentIndex > 0 && (
                        <button onClick={() => setCurrentIndex(prev => prev - 1)} style={{ background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '1rem', transition: 'border-color 0.2s' }}
                            onMouseEnter={e => e.target.style.borderColor = 'var(--terra)'}
                            onMouseLeave={e => e.target.style.borderColor = 'var(--cream-dark)'}
                        >←</button>
                    )}
                    <div style={{ flex: 1, height: '4px', background: 'var(--cream-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(to right, var(--terra), var(--sand))', width: `${(currentIndex / questions.length) * 100}%`, transition: 'width 0.3s ease', borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>{currentIndex + 1}/{questions.length}</span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--ink)', textAlign: 'center', fontWeight: 400 }}>{q.text}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt.text)}
                            style={{
                                padding: '18px 20px',
                                background: answers.find(a => a.questionId === q.id && a.answer === opt.text) ? 'rgba(196,97,58,0.06)' : 'var(--warm-white)',
                                border: answers.find(a => a.questionId === q.id && a.answer === opt.text) ? '1.5px solid var(--terra)' : '1px solid var(--cream-dark)',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                color: 'var(--ink)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                fontWeight: 300,
                                lineHeight: 1.5,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(28,26,22,0.05)'; e.currentTarget.style.borderColor = 'var(--terra-light)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = answers.find(a => a.questionId === q.id && a.answer === opt.text) ? 'var(--terra)' : 'var(--cream-dark)'; }}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
