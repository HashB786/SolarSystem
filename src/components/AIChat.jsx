/**
 * AIChat.jsx — Floating COSMO AI chat widget.
 * Uses the Groq API (free tier, no credit card needed).
 * API key is stored in localStorage. Get one free at console.groq.com.
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Settings, ExternalLink, Bot } from 'lucide-react';

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const MAX_HISTORY = 12; // keep last 12 messages in context

const SYSTEM_PROMPT = `You are COSMO, a friendly and knowledgeable AI assistant for Space Explorer, an educational website about our solar system. You specialise in astronomy, planetary science, space missions, and cosmic phenomena. Keep responses concise (2-4 sentences unless the user asks for more detail). Be engaging and enthusiastic. Use occasional space emojis 🚀🪐⭐🌙. Provide accurate scientific facts. If asked something completely unrelated to space or science, gently redirect back to cosmic topics.`;

const QUICK_Q = [
  'Which planet is the biggest?',
  "What are Saturn's rings made of?",
  'Tell me about the Great Red Spot',
  'Could humans live on Mars?',
];

/* Simple markdown-ish bold renderer (wraps **text** in <strong>) */
function MsgText({ content }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

export default function AIChat() {
  const [open,         setOpen]         = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey,       setApiKey]       = useState(() => localStorage.getItem('cosmoGroqKey') || '');
  const [keyDraft,     setKeyDraft]     = useState('');
  const [messages,     setMessages]     = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **COSMO** 🚀 — your AI space guide. Ask me anything about planets, space missions, or the cosmos!",
    },
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* Focus input when chat opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  /* Open settings automatically if no key */
  useEffect(() => {
    if (open && !apiKey) setSettingsOpen(true);
  }, [open]);

  const saveKey = () => {
    const trimmed = keyDraft.trim();
    setApiKey(trimmed);
    localStorage.setItem('cosmoGroqKey', trimmed);
    setKeyDraft('');
    setSettingsOpen(false);
    setError('');
  };

  const send = async (text = input.trim()) => {
    if (!text || loading) return;

    if (!apiKey) {
      setSettingsOpen(true);
      setError('Add your free Groq API key to chat with COSMO.');
      return;
    }

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      /* Keep last MAX_HISTORY messages in context (skip the initial greeting) */
      const history = messages.slice(1).concat(userMsg).slice(-MAX_HISTORY);

      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
          ],
          max_tokens: 400,
          temperature: 0.72,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `HTTP ${res.status}`);
      }

      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I got an empty response. Try again!';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="fixed bottom-8 left-6 z-50 flex flex-col items-start above-canvas">

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 16,    scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="mb-4 flex flex-col"
            style={{
              width: 'min(340px, calc(100vw - 3rem))',
              height: 480,
              background: 'linear-gradient(145deg, #0e0e28 0%, #180830 100%)',
              border: '1px solid rgba(124,58,237,0.5)',
              borderRadius: '1.2rem',
              boxShadow: '0 0 50px rgba(124,58,237,0.22), 0 20px 60px rgba(0,0,0,0.85)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.28)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 12px rgba(124,58,237,0.5)' }}
                >
                  🤖
                </div>
                <div>
                  <div className="font-heading font-bold text-white text-sm leading-none">COSMO</div>
                  <div className="text-gray-500 text-xs mt-0.5">Space AI · Powered by Groq</div>
                </div>
                {/* Online indicator */}
                {apiKey && (
                  <span className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #22c55e' }} />
                )}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSettingsOpen(s => !s)}
                  className="text-gray-500 hover:text-gray-200 transition-colors"
                  aria-label="API key settings"
                >
                  <Settings size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-200 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden flex-shrink-0"
                  style={{ borderBottom: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.07)' }}
                >
                  <div className="px-4 py-3 space-y-2 text-xs">
                    <p className="text-gray-300 font-semibold">
                      🔑 Free Groq API Key
                      {' '}
                      <a
                        href="https://console.groq.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 inline-flex items-center gap-0.5 hover:text-purple-300 underline"
                      >
                        Get one free <ExternalLink size={10} />
                      </a>
                    </p>
                    <p className="text-gray-500">No credit card needed · 30 req/min free</p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder={apiKey ? '••••••••••••••• (saved)' : 'gsk_…'}
                        value={keyDraft}
                        onChange={e => setKeyDraft(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveKey()}
                        autoComplete="off"
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-white text-xs focus:outline-none"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(124,58,237,0.4)',
                        }}
                      />
                      <button
                        onClick={saveKey}
                        className="px-3 py-1.5 rounded-lg font-heading font-bold text-white text-xs"
                        style={{ background: '#7c3aed' }}
                      >
                        Save
                      </button>
                    </div>
                    {apiKey && !keyDraft && (
                      <p className="text-green-400 text-xs">✓ API key active</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1 mr-1.5"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                    >
                      🤖
                    </div>
                  )}
                  <div
                    className="max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'rgba(124,58,237,0.65)',
                            color: '#fff',
                            borderBottomRightRadius: '4px',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(124,58,237,0.22)',
                            color: '#ddd',
                            borderBottomLeftRadius: '4px',
                          }
                    }
                  >
                    <MsgText content={msg.content} />
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                  >
                    🤖
                  </div>
                  <div
                    className="rounded-2xl px-4 py-2.5 flex gap-1"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.22)' }}
                  >
                    {[0, 150, 300].map(delay => (
                      <span
                        key={delay}
                        className="block w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* Quick questions (shown on fresh start) */}
              {messages.length === 1 && !loading && (
                <div className="mt-1 space-y-1.5">
                  <p className="text-gray-600 text-xs px-1">Try asking:</p>
                  {QUICK_Q.map(q => (
                    <motion.button
                      key={q}
                      whileHover={{ x: 3 }}
                      onClick={() => send(q)}
                      className="block w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white transition-colors"
                      style={{
                        background: 'rgba(124,58,237,0.1)',
                        border: '1px solid rgba(124,58,237,0.22)',
                      }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 flex gap-2 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(124,58,237,0.2)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask COSMO about space…"
                disabled={loading}
                maxLength={500}
                className="flex-1 px-3 py-2 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(124,58,237,0.35)',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-35"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                aria-label="Send message"
              >
                <Send size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl"
        style={{
          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
          boxShadow: '0 0 25px rgba(124,58,237,0.55), 0 4px 20px rgba(0,0,0,0.4)',
        }}
        aria-label={open ? 'Close COSMO AI chat' : 'Open COSMO AI space assistant'}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>✕</motion.span>
            : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>🤖</motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
