import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MarqueeTicker from '../components/MarqueeTicker';
import PlanetGraphic from '../components/PlanetGraphic';

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const WHY_CARDS = [
  {
    icon:  '🔭',
    title: 'Scientific Discovery',
    text:  'Space missions have revealed the building blocks of our solar system, discovered thousands of exoplanets, and unlocked the physics of black holes and dark matter.',
  },
  {
    icon:  '🛰️',
    title: 'Technology Innovation',
    text:  'GPS, memory foam, water purification, and scratch-resistant lenses all originated from space research. The cosmos drives innovation back on Earth every day.',
  },
  {
    icon:  '🌍',
    title: "Humanity's Future",
    text:  'With resources limited on Earth, space offers a path forward. Asteroid mining, off-world colonies, and interplanetary civilizations could ensure our long-term survival.',
  },
];

const SATURN = {
  name: 'Saturn', type: 'outer', color: 'saturn', hasRings: true,
  diameter: '120,536 km', moons: 146, distance: '1.43B km', temp: '−140°C avg',
};

const STATS = [
  { value: '8',   label: 'Major Planets',   color: 'text-purple-400' },
  { value: '290+',label: 'Known Moons',     color: 'text-yellow-400' },
  { value: '4.6B',label: 'Years Old',       color: 'text-purple-400' },
  { value: '∞',   label: 'Mysteries Left',  color: 'text-yellow-400' },
];

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ====== HERO ====== */}
      <section
        className="hero-gradient min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16"
        aria-labelledby="hero-heading"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          <motion.p
            variants={fadeUp}
            className="font-heading text-yellow-400 text-xs md:text-sm tracking-widest uppercase mb-6"
          >
            ✦ Welcome to the Cosmos ✦
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="font-heading font-black text-white glow-heading leading-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 9vw, 6.5rem)' }}
          >
            Explore The<br />
            <span className="text-purple-400">Universe</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Embark on an interstellar journey through our solar system.
            Discover the wonders of planets, test your cosmic knowledge,
            and unlock the mysteries of space.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/planets"
                className="glow-btn-shadow block font-heading font-bold py-4 px-10 rounded-xl text-sm tracking-wide text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
              >
                🪐 Explore Planets
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/quiz"
                className="block font-heading font-bold py-4 px-10 rounded-xl text-sm tracking-wide text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 transition-all"
              >
                🧠 Take the Quiz
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-20 text-gray-600 animate-bounce"
            aria-hidden="true"
          >
            <ChevronDown className="mx-auto" size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* ====== MARQUEE ====== */}
      <MarqueeTicker />

      {/* ====== WHY SPACE ====== */}
      <section className="py-24 px-4 md:px-8" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              id="why-heading"
              variants={fadeUp}
              className="font-heading text-3xl md:text-4xl font-black text-white glow-heading mb-4"
            >
              Why Explore Space?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto leading-relaxed">
              Space exploration has driven humanity's greatest achievements in science,
              technology, and our understanding of existence.
            </motion.p>
          </motion.header>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {WHY_CARDS.map(({ icon, title, text }) => (
              <motion.article
                key={title}
                variants={cardVariant}
                whileHover={{ y: -6 }}
                className="glass glow-card-shadow rounded-2xl p-8"
              >
                <div className="text-5xl mb-5" aria-hidden="true">{icon}</div>
                <h3 className="font-heading text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURED PLANET (SATURN) ====== */}
      <section
        className="py-24 px-4 md:px-8 border-t border-purple-900/30"
        aria-labelledby="featured-heading"
      >
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-heading text-yellow-400 text-xs tracking-widest uppercase mb-2">
              Featured Planet
            </p>
            <h2
              id="featured-heading"
              className="font-heading text-3xl md:text-4xl font-black text-white glow-heading"
            >
              Saturn — Jewel of the Solar System
            </h2>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* CSS Planet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
              className="flex justify-center"
            >
              <div className="animate-float">
                <PlanetGraphic planet={SATURN} size={210} />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
                {[
                  '⬤ 120,536 km diameter',
                  '🌙 146 moons',
                  '☀️ 1.43 billion km',
                  '🌡️ −140°C average',
                ].map(chip => (
                  <span key={chip} className="stat-chip">{chip}</span>
                ))}
              </motion.div>

              <motion.p variants={fadeUp} className="text-gray-300 leading-relaxed mb-4">
                Saturn is the sixth planet from the Sun and the second-largest in our solar system.
                Its iconic rings — composed of billions of ice and rock particles — span an
                incredible 282,000 km, yet are only about 20 metres thick in places.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-300 leading-relaxed mb-6">
                With 146 known moons, Saturn leads the solar system in natural satellites.
                Its moon Titan even has a thick atmosphere and liquid methane lakes, making
                it one of the most Earth-like worlds we've ever found.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="glass rounded-xl p-4 mb-8 border-l-4"
                style={{ borderLeftColor: '#f59e0b' }}
              >
                <p className="font-heading text-yellow-400 text-xs font-bold mb-1 tracking-widest">
                  FUN FACT
                </p>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Saturn is the only planet less dense than water — if you could find a
                  bathtub big enough, it would float!
                </p>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/planets"
                  className="glow-btn-shadow inline-block font-heading font-bold py-3 px-8 rounded-xl text-sm text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                >
                  Explore All Planets →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== STATS BANNER ====== */}
      <section
        className="py-16 px-4 md:px-8 border-t border-purple-900/30"
        aria-label="Solar system at a glance"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-6"
            >
              <div className={`font-heading text-4xl md:text-5xl font-black mb-2 ${color}`}>
                {value}
              </div>
              <div className="text-gray-400 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
