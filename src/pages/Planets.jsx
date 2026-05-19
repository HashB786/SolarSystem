import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { PLANETS } from '../data/planets';
import PlanetCard from '../components/PlanetCard';
import PlanetModal from '../components/PlanetModal';
import ExitButton from '../components/ExitButton';

const FILTERS = ['all', 'inner', 'outer', 'dwarf'];

export default function Planets() {
  const [filter,   setFilter]   = useState('all');
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(null);

  const visible = useMemo(() => {
    let list = PLANETS;
    if (filter !== 'all') list = list.filter(p => p.type === filter);
    if (query.trim())     list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [filter, query]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-28 pb-24 px-4 md:px-8"
    >
      <ExitButton />
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white glow-heading mb-4">
            Our Solar System
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Explore all 8 planets plus Pluto. Filter by type, search by name,
            then click any card to dive deeper.
          </p>
        </motion.header>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10"
        >
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search planets…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.35)' }}
              aria-label="Search planets by name"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap justify-center" role="group" aria-label="Filter by planet type">
            {FILTERS.map(f => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-heading font-bold border transition-all ${
                  filter === f
                    ? 'bg-primary border-primary text-white shadow-[0_0_14px_rgba(124,58,237,0.5)]'
                    : 'border-purple-800/50 text-gray-400 hover:border-primary hover:text-white'
                }`}
                aria-pressed={filter === f}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Planet grid with layout animation */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.length > 0 ? (
              visible.map((planet, i) => (
                <PlanetCard
                  key={planet.name}
                  planet={planet}
                  index={i}
                  onClick={() => setSelected(planet)}
                />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20 text-gray-500"
              >
                <div className="text-5xl mb-4" aria-hidden="true">🔭</div>
                <p className="font-heading text-lg">No planets found</p>
                <p className="text-sm mt-2 text-gray-600">Try a different search or filter</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <PlanetModal planet={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
