import { useReducer, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QUIZ } from '../data/quiz';
import ExitButton from '../components/ExitButton';

/* ===================== REDUCER ===================== */
const init = {
  phase:        'playing', // 'playing' | 'results'
  current:      0,
  score:        0,
  selected:     null,
  showFeedback: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT': {
      if (state.showFeedback) return state;
      const correct = action.index === QUIZ[state.current].correct;
      return { ...state, selected: action.index, showFeedback: true, score: state.score + (correct ? 1 : 0) };
    }
    case 'NEXT': {
      const next = state.current + 1;
      if (next >= QUIZ.length) return { ...state, phase: 'results', showFeedback: false };
      return { ...state, current: next, selected: null, showFeedback: false };
    }
    case 'RESTART':
      return { ...init };
    default:
      return state;
  }
}

/* ===================== HELPERS ===================== */
function getOptionClass(state, i) {
  if (!state.showFeedback) return '';
  if (i === QUIZ[state.current].correct) return 'correct';
  if (i === state.selected)              return 'wrong';
  return '';
}

/* ===================== COMPONENT =================== */
export default function Quiz() {
  const [state, dispatch] = useReducer(reducer, init);
  const timerRef          = useRef(null);

  // Auto-advance after feedback
  useEffect(() => {
    if (!state.showFeedback) return;
    timerRef.current = setTimeout(() => dispatch({ type: 'NEXT' }), 1350);
    return () => clearTimeout(timerRef.current);
  }, [state.showFeedback]);

  const q       = QUIZ[state.current];
  const total   = QUIZ.length;
  const pct     = Math.round((state.score / total) * 100);
  const progress = ((state.current) / total) * 100;

  // Save high score
  const highScore = (() => {
    if (state.phase !== 'results') return null;
    const prev = parseInt(localStorage.getItem('spaceHighScore') || '0');
    const next = Math.max(prev, state.score);
    localStorage.setItem('spaceHighScore', next);
    return { best: next, isNew: state.score > prev };
  })();

  const resultData = state.phase === 'results' && (() => {
    if (pct >= 90) return { emoji: '🏆', msg: 'Space Genius!',         color: '#f59e0b' };
    if (pct >= 60) return { emoji: '🌟', msg: 'Not Bad, Space Cadet!', color: '#7c3aed' };
    return           { emoji: '📚', msg: 'Keep Studying, Explorer!',   color: '#60a5fa' };
  })();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-28"
    >
      <ExitButton />
      <div className="w-full max-w-2xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-5xl mb-4" aria-hidden="true">🧠</div>
          <h1 className="font-heading text-3xl md:text-4xl font-black text-white glow-heading mb-3">
            Space Quiz
          </h1>
          <p className="text-gray-400">
            {state.phase === 'playing'
              ? `10 questions — can you score 100%?`
              : 'Quiz complete!'}
          </p>
        </motion.header>

        {/* Question phase */}
        <AnimatePresence mode="wait">
          {state.phase === 'playing' && (
            <motion.div
              key={state.current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.28 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 font-heading">
                  <span className="text-gray-400">
                    Question {state.current + 1} of {total}
                  </span>
                  <span className="text-yellow-400">Score: {state.score}</span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 8, background: 'rgba(255,255,255,0.08)' }}
                  role="progressbar"
                  aria-valuenow={state.current}
                  aria-valuemax={total}
                >
                  <motion.div
                    className="progress-bar-inner h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div
                className="glass rounded-xl p-5 mb-6"
                style={{ border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <p className="text-xs font-heading tracking-widest text-purple-400 mb-2">
                  QUESTION {state.current + 1}
                </p>
                <h2 className="font-heading text-lg md:text-xl font-bold text-white leading-snug">
                  {q.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={state.showFeedback ? {} : { x: 4 }}
                    whileTap={state.showFeedback ? {} : { scale: 0.98 }}
                    className={`quiz-option ${getOptionClass(state, i)}`}
                    onClick={() => dispatch({ type: 'SELECT', index: i })}
                    disabled={state.showFeedback}
                    aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                  >
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs font-bold font-heading flex-shrink-0"
                      style={{ border: '1px solid rgba(124,58,237,0.5)', color: '#7c3aed' }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results phase */}
          {state.phase === 'results' && resultData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, type: 'spring', stiffness: 200 }}
              className="glass rounded-2xl p-6 md:p-10 text-center"
            >
              <div className="text-6xl mb-4" aria-hidden="true">{resultData.emoji}</div>
              <h2
                className="font-heading text-2xl md:text-3xl font-black mb-3"
                style={{ color: resultData.color, textShadow: `0 0 20px ${resultData.color}88` }}
              >
                {resultData.msg}
              </h2>
              <p className="text-gray-400 mb-6 text-lg">
                You scored{' '}
                <strong className="text-white">{state.score}</strong>{' '}
                out of{' '}
                <strong className="text-white">{total}</strong>
              </p>

              {/* Progress bar */}
              <div
                className="w-full rounded-full overflow-hidden mb-2"
                style={{ height: 12, background: 'rgba(255,255,255,0.08)' }}
              >
                <motion.div
                  className="progress-bar-inner h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <p className="text-sm text-gray-500 mb-6">{pct}% correct</p>

              {/* High score */}
              {highScore && (
                <div className="glass inline-block px-6 py-3 rounded-xl mb-8">
                  <span className="text-gray-400 text-sm font-heading">🏅 HIGH SCORE: </span>
                  <span className="font-heading font-black text-lg text-yellow-400">
                    {highScore.best}/{total}
                  </span>
                  {highScore.isNew && (
                    <span className="ml-2 text-xs font-heading text-green-400">NEW BEST!</span>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => dispatch({ type: 'RESTART' })}
                  className="glow-btn-shadow font-heading font-bold py-3 px-8 rounded-xl text-sm text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                >
                  🔄 Try Again
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/planets"
                    className="block font-heading font-bold py-3 px-8 rounded-xl text-sm text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 transition-all"
                  >
                    🪐 Explore Planets
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.main>
  );
}
