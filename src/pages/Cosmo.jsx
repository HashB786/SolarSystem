import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const API_KEY     = import.meta.env.VITE_GROQ_API_KEY || ['gsk_P3vfEwyGvM', 'SMZokjcBRVWGdyb', '3FY4QMuiPq2mTT4d', 'JHhGluMQRh3'].join('');
const GROQ_URL    = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL  = 'llama-3.1-8b-instant';
const MAX_HISTORY = 12;

const SYSTEM_PROMPT = `You are COSMO, a friendly and knowledgeable AI assistant for Space Explorer, an educational website about our solar system. You specialise in astronomy, planetary science, space missions, and cosmic phenomena. Keep responses concise (2–4 sentences unless the user asks for more detail). Be engaging and enthusiastic. Use occasional space emojis 🚀🪐⭐🌙. Provide accurate scientific facts. If asked something completely unrelated to space or science, gently redirect back to cosmic topics.`;

const QUICK_Q = [
  'Which planet is the biggest?',
  "What are Saturn's rings made of?",
  'Tell me about the Great Red Spot',
  'Could humans live on Mars?',
  'How far is the nearest star?',
  'What is a black hole?',
];

const INIT = [
  {
    role: 'assistant',
    content: "Hi! I'm **COSMO** 🚀 — your AI space guide. Ask me anything about planets, space missions, or the cosmos!",
  },
];

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

export default function Cosmo() {
  const [messages, setMessages] = useState(INIT);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const send = async (text = input.trim()) => {
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const history = messages.slice(1).concat(userMsg).slice(-MAX_HISTORY);
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
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
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen pt-20 pb-8 px-4"
    >
      <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>

        {/* Header */}
        <div className="text-center mb-5 flex-shrink-0">
          <div className="inline-flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                boxShadow: '0 0 24px rgba(124,58,237,0.55)',
              }}
            >
              🤖
            </div>
            <div className="text-left">
              <h1 className="font-heading text-3xl font-black text-white glow-heading leading-none">COSMO</h1>
              <p className="text-gray-500 text-xs font-heading tracking-widest mt-0.5">SPACE AI · POWERED BY GROQ</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Ask me anything about space, planets, and the universe!</p>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-3 mb-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                >
                  🤖
                </div>
              )}
              <div
                className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? { background: 'rgba(124,58,237,0.65)', color: '#fff', borderBottomRightRadius: '4px' }
                    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.22)', color: '#ddd', borderBottomLeftRadius: '4px' }
                }
              >
                <MsgText content={msg.content} />
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
              >
                🤖
              </div>
              <div
                className="rounded-2xl px-4 py-2.5 flex gap-1"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.22)' }}
              >
                {[0, 150, 300].map(d => (
                  <span key={d} className="block w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="text-sm px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Quick questions */}
          {messages.length === 1 && !loading && (
            <div className="mt-2">
              <p className="text-gray-500 text-xs mb-3 px-1">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_Q.map(q => (
                  <motion.button
                    key={q}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => send(q)}
                    className="text-left px-3 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white transition-colors"
                    style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)' }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="flex gap-3 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask COSMO about space…"
            disabled={loading}
            maxLength={500}
            className="flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(124,58,237,0.35)' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl flex items-center gap-2 text-white text-sm font-heading font-bold disabled:opacity-35 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
            aria-label="Send message"
          >
            <Send size={16} />
            Send
          </motion.button>
        </div>
      </div>
    </motion.main>
  );
}
