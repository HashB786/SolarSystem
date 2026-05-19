import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const TECH_CARDS = [
  {
    icon:  'R',
    color: '#61dafb',
    bg:    'rgba(97,218,251,0.12)',
    border:'rgba(97,218,251,0.35)',
    title: 'React + Vite',
    text:  'Built as a Single Page Application using React 18 with component-based architecture. Vite provides near-instant dev server hot-reloading and optimised production builds. React Router v6 handles client-side navigation via HashRouter.',
  },
  {
    icon:  'TW',
    color: '#22d3ee',
    bg:    'rgba(34,211,238,0.12)',
    border:'rgba(34,211,238,0.35)',
    title: 'Tailwind CSS',
    text:  'All layout, spacing, and responsive design uses Tailwind utility classes with a custom theme extending the colour palette and font families. Mobile-first with sm:, md:, lg: breakpoints and a bespoke index.css for glow effects and planet gradients.',
  },
  {
    icon:  'FM',
    color: '#c084fc',
    bg:    'rgba(192,132,252,0.12)',
    border:'rgba(192,132,252,0.35)',
    title: 'Framer Motion',
    text:  'Smooth spring-physics animations throughout: staggered hero text, layout-animated planet grid (cards re-flow without a flash when filters change), spring modal entrance, question slide transitions in the quiz, and page fade transitions via AnimatePresence.',
  },
  {
    icon:  '🎨',
    color: '#f59e0b',
    bg:    'rgba(245,158,11,0.12)',
    border:'rgba(245,158,11,0.35)',
    title: 'Canvas API + localStorage',
    text:  'The animated starfield runs via the HTML5 Canvas API inside a React useEffect with requestAnimationFrame, twinkling each star individually using Math.sin(). useReducer manages quiz state as a finite state machine. localStorage persists dark-mode and high score across sessions.',
  },
];

const TECH_BADGES = [
  { label: 'React 18',        c: 'rgba(97,218,251,0.12)',  b: 'rgba(97,218,251,0.4)',  t: '#93e6fb' },
  { label: 'Vite',            c: 'rgba(168,85,247,0.12)',  b: 'rgba(168,85,247,0.4)',  t: '#c084fc' },
  { label: 'React Router v6', c: 'rgba(239,68,68,0.12)',   b: 'rgba(239,68,68,0.4)',   t: '#fca5a5' },
  { label: 'Framer Motion',   c: 'rgba(192,132,252,0.12)', b: 'rgba(192,132,252,0.4)', t: '#d8b4fe' },
  { label: 'Tailwind CSS',    c: 'rgba(34,211,238,0.12)',  b: 'rgba(34,211,238,0.4)',  t: '#67e8f9' },
  { label: 'Canvas API',      c: 'rgba(245,158,11,0.12)',  b: 'rgba(245,158,11,0.4)',  t: '#fcd34d' },
  { label: 'Google Fonts',    c: 'rgba(59,130,246,0.12)',  b: 'rgba(59,130,246,0.4)',  t: '#93c5fd' },
  { label: 'localStorage',    c: 'rgba(34,197,94,0.12)',   b: 'rgba(34,197,94,0.4)',   t: '#86efac' },
];

const LEARNED = [
  {
    title: 'React component architecture',
    text:  'Splitting the app into reusable components (PlanetCard, PlanetModal, PlanetGraphic, MarqueeTicker) with clear responsibilities makes the codebase easy to navigate and reason about. Each component manages only what it needs.',
  },
  {
    title: 'useReducer for complex state',
    text:  'The quiz uses useReducer to model a finite state machine with phases (playing → results → playing). Dispatch actions are predictable and testable, which is far cleaner than multiple useState calls for interconnected state.',
  },
  {
    title: 'Framer Motion layout animations',
    text:  "Wrapping the planet grid in a motion.div with layout={true} and AnimatePresence with mode='popLayout' means React automatically animates cards in, out, and reflows when filters change — for free, with zero manual DOM code.",
  },
  {
    title: 'Canvas API within React',
    text:  'Using useEffect + useRef to initialise a canvas animation is a key React pattern for imperative APIs. The cleanup function (return () => cancelAnimationFrame(id)) prevents memory leaks when the component unmounts.',
  },
  {
    title: 'Spring-physics with Framer Motion',
    text:  'Natural UI motion comes from spring-physics (stiffness, damping) rather than cubic-bezier curves. The modal entrance uses type: spring which gives it realistic weight and feel compared to a linear animation.',
  },
  {
    title: 'Context API for shared state',
    text:  'DarkModeContext avoids prop-drilling the dark/light toggle through every component. useContext makes it available anywhere in the tree, and useEffect syncs the state to localStorage and the DOM automatically.',
  },
];

export default function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-28 pb-24 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white glow-heading mb-4">
            About This Project
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            A deep dive into how Space Explorer was designed and built —
            from the React component tree to the physics-based animations
            that bring the cosmos to life in your browser.
          </p>
        </motion.header>

        {/* Vision */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-14"
          aria-labelledby="vision-heading"
        >
          <div className="glass glow-card-shadow rounded-2xl p-6 md:p-8">
            <h2 id="vision-heading" className="font-heading text-2xl font-bold text-white mb-4">
              🚀 The Vision
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Space Explorer was built to make astronomy accessible and exciting.
              The goal: a visually immersive, interactive experience that feels like stepping
              into mission control — built entirely in the browser with modern tools,
              no backend required.
            </p>
            <p className="text-gray-300 leading-relaxed">
              The stack was chosen deliberately: React for declarative UI and component
              reusability, Framer Motion for physics-based animations that feel natural,
              and Tailwind CSS for rapid, consistent styling. The result is a site that looks
              custom but is highly maintainable.
            </p>
          </div>
        </motion.section>

        {/* How it was built */}
        <section className="mb-14" aria-labelledby="built-heading">
          <motion.h2
            id="built-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl font-bold text-white glow-heading mb-8 text-center"
          >
            How It Was Built
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {TECH_CARDS.map(({ icon, color, bg, border, title, text }) => (
              <motion.article
                key={title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="glass glow-card-shadow rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-heading font-black text-sm"
                    style={{ background: bg, border: `1px solid ${border}`, color }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-heading font-bold text-white">{title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* Tech badges */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
          aria-labelledby="tech-heading"
        >
          <h2 id="tech-heading" className="font-heading text-2xl font-bold text-white mb-8">
            Technologies Used
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_BADGES.map(({ label, c, b, t }) => (
              <motion.span
                key={label}
                whileHover={{ scale: 1.08, y: -2 }}
                className="tech-badge"
                style={{ background: c, borderColor: b, color: t }}
              >
                {label}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* What I Learned */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
          aria-labelledby="learned-heading"
        >
          <div className="glass glow-card-shadow rounded-2xl p-6 md:p-8">
            <h2 id="learned-heading" className="font-heading text-2xl font-bold text-white mb-7">
              🎓 What I Learned
            </h2>
            <ul className="space-y-6">
              {LEARNED.map(({ title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="text-yellow-400 text-xl mt-0.5 flex-shrink-0" aria-hidden="true">
                    ✦
                  </span>
                  <div>
                    <strong className="text-white font-semibold">{title}</strong>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Closing */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          aria-label="Closing note"
        >
          <div className="glass glow-card-shadow rounded-2xl p-8">
            <div className="text-5xl mb-4" aria-hidden="true">🌌</div>
            <h2 className="font-heading text-xl font-bold text-white mb-3">Built with Curiosity</h2>
            <p className="text-gray-400 leading-relaxed max-w-md mx-auto mb-8">
              This project was an exploration of both the solar system and the modern web ecosystem.
              React + Framer Motion + Tailwind is a powerful trio that delivers impressive results
              while keeping the codebase clean and maintainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/planets"
                  className="glow-btn-shadow block font-heading font-bold py-3 px-8 rounded-xl text-sm text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                >
                  🪐 Explore the Planets
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/quiz"
                  className="block font-heading font-bold py-3 px-8 rounded-xl text-sm text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 transition-all"
                >
                  🧠 Take the Quiz
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

      </div>
    </motion.main>
  );
}
