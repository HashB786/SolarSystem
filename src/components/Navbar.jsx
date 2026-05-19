import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/planets',      label: 'Planets' },
  { to: '/solar-system', label: 'Solar System' },
  { to: '/quiz',         label: 'Quiz' },
  { to: '/cosmo',        label: 'COSMO AI' },
  { to: '/about',        label: 'About' },
];

const navLinkClass = ({ isActive }) =>
  `font-heading text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
    isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggle }      = useDarkMode();

  return (
    <nav
      className="navbar-glass fixed top-0 left-0 right-0 z-20 px-4 md:px-6 above-canvas"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink
          to="/"
          className="font-heading font-black text-lg flex items-center gap-2 flex-shrink-0"
          aria-label="Space Explorer — Home"
          onClick={() => setMenuOpen(false)}
        >
          <span aria-hidden="true" className="text-2xl">🚀</span>
          <span className="glow-accent">Space</span>
          <span className="text-purple-400">Explorer</span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass} end={to === '/'}>
              {label}
            </NavLink>
          ))}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="text-xl ml-2"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun size={20} className="text-yellow-400" />
              : <Moon size={20} className="text-purple-400" />
            }
          </motion.button>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun size={18} className="text-yellow-400" />
              : <Moon size={18} className="text-purple-400" />
            }
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden overflow-hidden px-2 pb-4"
          >
            <div className="glass rounded-xl p-4 mt-2 flex flex-col gap-3">
              {LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={navLinkClass}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
