/**
 * SolarSystem.jsx — Interactive 3D solar system page.
 * Clicking a planet slides in a detail panel from the right.
 * Drag to rotate, scroll to zoom, click any planet for info.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer, ZoomIn, RotateCcw } from 'lucide-react';
import SolarSystemViewer from '../components/SolarSystemViewer';
import PlanetGraphic from '../components/PlanetGraphic';

const STAT_ROWS = [
  ['Diameter',     p => p.diameter],
  ['Moons',        p => p.moons],
  ['Distance',     p => p.distance],
  ['Avg Temp',     p => p.temp],
  ['Orbit Period', p => p.orbitPeriod],
  ['Gravity',      p => p.gravity],
];

const BADGE_CLASS = { inner: 'badge-inner', outer: 'badge-outer', dwarf: 'badge-dwarf' };

export default function SolarSystem() {
  const [selected, setSelected] = useState(null);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed',
        top: '4rem',       // below navbar
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      {/* ── 3D Canvas ── */}
      <SolarSystemViewer onPlanetSelect={setSelected} />

      {/* ── Title overlay (top-left) ── */}
      <div
        className="absolute top-4 left-4 z-10 pointer-events-none"
        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
      >
        <h1 className="font-heading text-xl md:text-3xl font-black text-white glow-heading leading-tight">
          Solar System
        </h1>
        <p className="text-gray-400 text-xs mt-1 font-heading tracking-widest">
          INTERACTIVE 3D MODEL
        </p>
      </div>

      {/* ── Controls hint (bottom-centre) ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div
          className="flex items-center gap-5 px-5 py-2 rounded-full text-xs text-gray-400 font-heading"
          style={{ background: 'rgba(10,10,26,0.7)', border: '1px solid rgba(124,58,237,0.25)' }}
        >
          <span className="flex items-center gap-1.5">
            <MousePointer size={12} />
            Click planet
          </span>
          <span className="flex items-center gap-1.5">
            <RotateCcw size={12} />
            Drag to rotate
          </span>
          <span className="flex items-center gap-1.5">
            <ZoomIn size={12} />
            Scroll to zoom
          </span>
        </div>
      </div>

      {/* ── Planet info panel (slides in from right) ── */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSelected(null)}
            />

            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0,      opacity: 1 }}
              exit={{ x: '100%',    opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="absolute top-0 right-0 bottom-0 z-20 overflow-y-auto"
              style={{
                width: 'min(360px, 92vw)',
                background: 'linear-gradient(160deg, rgba(14,14,40,0.97) 0%, rgba(24,8,48,0.97) 100%)',
                borderLeft: '1px solid rgba(124,58,237,0.4)',
                backdropFilter: 'blur(12px)',
              }}
              aria-label={`${selected.name} details panel`}
            >
              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                aria-label="Close panel"
              >
                <X size={20} />
              </motion.button>

              <div className="p-5 pt-6">
                {/* Planet graphic */}
                <div className="flex justify-center mb-4">
                  <div className="animate-float">
                    <PlanetGraphic planet={selected} size={90} />
                  </div>
                </div>

                {/* Name */}
                <h2 className="font-heading text-2xl font-black text-white glow-heading text-center mb-2">
                  {selected.name}
                </h2>
                <div className="flex justify-center mb-5">
                  <span className={`badge ${BADGE_CLASS[selected.type]}`}>
                    {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)} Planet
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  {selected.description}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {STAT_ROWS.map(([label, fn]) => (
                    <div
                      key={label}
                      className="rounded-xl p-2.5 text-center"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)' }}
                    >
                      <div className="text-yellow-400 font-heading text-xs mb-1 tracking-wider">
                        {label.toUpperCase()}
                      </div>
                      <div className="text-white text-xs font-semibold">{fn(selected)}</div>
                    </div>
                  ))}
                </div>

                {/* Fun fact */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(245,158,11,0.07)',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  <p className="text-yellow-400 font-heading text-xs font-bold mb-2 tracking-widest">
                    💡 FUN FACT
                  </p>
                  <p className="text-gray-200 text-xs leading-relaxed">{selected.funFact}</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
