import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function ExitButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed top-24 right-6 md:right-10 z-50"
    >
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-2 rounded-full font-heading font-bold text-sm shadow-lg transition-all"
        style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#fca5a5',
          backdropFilter: 'blur(8px)'
        }}
      >
        <Home size={16} />
        Exit to Home
      </Link>
    </motion.div>
  );
}
