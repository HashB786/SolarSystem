import React from 'react';
import { motion } from 'framer-motion';
import PlanetGraphic from './PlanetGraphic';

const BADGE = {
  inner: 'badge-inner',
  outer: 'badge-outer',
  dwarf: 'badge-dwarf',
  star:  'badge-star',
  belt:  'badge-belt',
};

const PlanetCard = React.forwardRef(({ planet, onClick, index }, ref) => {
  const typeLabel = planet.type.charAt(0).toUpperCase() + planet.type.slice(1);

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.055, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.025 }}
      className="glass rounded-2xl glow-card-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`View details for ${planet.name}`}
    >
      <div className="p-6">
        {/* Planet graphic */}
        <div className="flex justify-center mb-5">
          <div className="animate-float">
            <PlanetGraphic planet={planet} size={80} />
          </div>
        </div>

        {/* Name + badge */}
        <div className="text-center mb-4">
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {planet.name}
          </h3>
          <span className={`badge ${BADGE[planet.type]}`}>{typeLabel}</span>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          <span className="stat-chip">⬤ {planet.diameter}</span>
          <span className="stat-chip">
            🌙 {planet.moons} moon{planet.moons !== 1 ? 's' : ''}
          </span>
          <span className="stat-chip">☀️ {planet.distance}</span>
        </div>
      </div>
    </motion.article>
  );
});

export default PlanetCard;
