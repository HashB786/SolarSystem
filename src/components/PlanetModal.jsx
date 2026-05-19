import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import PlanetGraphic from './PlanetGraphic';

const BADGE = {
  inner: 'badge-inner',
  outer: 'badge-outer',
  dwarf: 'badge-dwarf',
  star:  'badge-star',
  belt:  'badge-belt',
};

const TYPE_LABEL = {
  inner: 'Inner Planet',
  outer: 'Outer Planet',
  dwarf: 'Dwarf Planet',
  star:  'Star',
  belt:  'Asteroid Belt',
};

const STATS = [
  ['DIAMETER',     p => p.diameter],
  ['MOONS',        p => p.moons],
  ['DISTANCE',     p => p.distance],
  ['AVG TEMP',     p => p.temp],
  ['ORBIT PERIOD', p => p.orbitPeriod],
  ['GRAVITY',      p => p.gravity],
];

export default function PlanetModal({ planet, onClose }) {
  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const typeLabel = planet.type.charAt(0).toUpperCase() + planet.type.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: -24, opacity: 0 }}
        animate={{ scale: 1,    y: 0,   opacity: 1 }}
        exit={{ scale: 0.85,    y: -24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="modal-content max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${planet.name} details`}
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-black text-white glow-heading">
                {planet.name}
              </h2>
              <span className={`badge ${BADGE[planet.type]} mt-2`}>
                {TYPE_LABEL[planet.type] || planet.type}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-4 mt-1"
              aria-label="Close modal"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Planet graphic */}
          <div className="flex justify-center mb-6 animate-float">
            <PlanetGraphic planet={planet} size={100} />
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
            {planet.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {STATS.map(([label, fn]) => (
              <div key={label} className="glass rounded-xl p-3 text-center">
                <div className="text-yellow-400 font-heading text-xs mb-1 tracking-widest">
                  {label}
                </div>
                <div className="text-white font-semibold text-sm">{fn(planet)}</div>
              </div>
            ))}
          </div>

          {/* Fun fact */}
          <div
            className="rounded-xl p-4"
            style={{ border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-lg" aria-hidden="true">💡</span>
              <span className="font-heading text-yellow-400 text-xs font-bold tracking-widest">
                FUN FACT
              </span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{planet.funFact}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
