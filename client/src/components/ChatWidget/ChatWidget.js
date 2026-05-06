import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../services/api';

const ChatWidget = ({ trip }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    const handleSend = async (text = input) => {
        if (!text.trim() || !trip) return;
        const userMsg = { role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            const res = await aiAPI.chat(trip._id, { history: messages, message: text });
            setMessages(prev => [...prev, { role: 'ai', content: res.reply || res.suggestedChanges || "API response could not be parsed.", timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I failed to process that request.', timestamp: new Date() }]);
        } finally { setIsTyping(false); }
    };

    const quickPrompts = ["What's a good alternative if it rains?", "Where can I find nice local food nearby?", "Can we make this day cheaper?"];

    const bubbleStyle = (isUser) => ({
        maxWidth: '85%', padding: '10px 14px', borderRadius: '16px',
        borderBottomRightRadius: isUser ? '4px' : '16px', borderBottomLeftRadius: !isUser ? '4px' : '16px',
        background: isUser ? 'var(--terra)' : 'var(--cream)',
        color: isUser ? 'var(--warm-white)' : 'var(--ink)',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 300,
    });

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            {/* Panel */}
            <div style={{
                position: 'absolute', bottom: '80px', right: 0, width: '350px', height: '500px',
                background: 'var(--warm-white)', border: '1px solid var(--cream-dark)', borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(28,26,22,0.12)', display: isOpen ? 'flex' : 'none',
                flexDirection: 'column', overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{ padding: '1rem 1.2rem', background: 'var(--terra)', color: 'var(--warm-white)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '1.3rem' }}>✦</div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--warm-white)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>DTOUR Assistant</h3>
                        <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.8, fontWeight: 300 }}>Always here to help your trip</p>
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--ink-muted)', marginTop: '2rem' }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1rem' }}>Hi! I'm your AI travel co-pilot.</p>
                            {quickPrompts.map((p, i) => (
                                <button key={i} onClick={() => handleSend(p)} style={{
                                    display: 'block', width: '100%', padding: '10px 14px', background: 'rgba(196,97,58,0.06)',
                                    color: 'var(--terra)', border: '1px solid rgba(196,97,58,0.1)', borderRadius: '12px',
                                    marginBottom: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '0.88rem',
                                    fontFamily: 'inherit', fontWeight: 400, transition: 'background 0.2s',
                                }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(196,97,58,0.1)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(196,97,58,0.06)'}
                                >{p}</button>
                            ))}
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={bubbleStyle(m.role === 'user')}>{m.content}</div>
                            <span style={{ fontSize: '0.62rem', color: 'var(--ink-muted)', marginTop: '4px', padding: '0 5px' }}>
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ ...bubbleStyle(false), display: 'flex', gap: '4px', width: '60px', justifyContent: 'center' }}>
                            {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: '7px', height: '7px', background: 'var(--terra)', borderRadius: '50%', animation: `bounce 1.4s infinite ease-in-out both`, animationDelay: `${d}s` }} />)}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '0.8rem 1rem', background: 'var(--cream)', borderTop: '1px solid var(--cream-dark)', display: 'flex', gap: '8px' }}>
                    <textarea value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Ask anything..."
                        style={{ flex: 1, border: '1px solid var(--cream-dark)', borderRadius: '12px', padding: '10px 12px', resize: 'none', height: '42px', fontFamily: 'inherit', fontSize: '0.9rem', background: 'var(--warm-white)', color: 'var(--ink)', outline: 'none' }}
                    />
                    <button onClick={() => handleSend()} style={{
                        background: 'var(--terra)', color: 'var(--warm-white)', border: 'none', borderRadius: '12px',
                        width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transition: 'background 0.2s', fontSize: '0.9rem',
                    }}
                        onMouseEnter={e => e.target.style.background = '#B05530'}
                        onMouseLeave={e => e.target.style.background = 'var(--terra)'}
                    >➤</button>
                </div>
            </div>

            {/* FAB */}
            <button style={{
                width: '56px', height: '56px', borderRadius: '50%', background: 'var(--terra)',
                color: 'var(--warm-white)', border: 'none', boxShadow: '0 8px 24px rgba(196,97,58,0.35)',
                cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, transform 0.15s', position: 'relative',
            }} onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={e => { e.currentTarget.style.background = '#B05530'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--terra)'; e.currentTarget.style.transform = 'none'; }}
            >
                {isOpen ? '✕' : '💬'}
                {!isOpen && <div style={{ position: 'absolute', top: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--sage)', border: '2px solid var(--cream)' }} />}
            </button>
        </div>
    );
};

export default ChatWidget;
