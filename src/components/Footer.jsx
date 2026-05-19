import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/planets', label: 'Planets' },
  { to: '/quiz',    label: 'Quiz' },
  { to: '/about',   label: 'About' },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-purple-900/30 py-10 px-4 md:px-8 above-canvas"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-heading font-black text-lg mb-1">
            <span className="glow-accent">Space</span>
            <span className="text-purple-400">Explorer</span>
          </div>
          <p className="text-gray-600 text-xs">Charting the cosmos, one planet at a time.</p>
        </div>

        <nav aria-label="Footer navigation">
          <div className="flex gap-6 text-sm font-heading">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500 hover:text-purple-400'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <p className="text-gray-700 text-xs">© 2025 Space Explorer. All rights reserved.</p>
      </div>
    </footer>
  );
}
