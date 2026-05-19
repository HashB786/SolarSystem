/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space:   '#0a0a1a',
        primary: '#7c3aed',
        accent:  '#f59e0b',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 50s linear infinite',
        float:   'float 4s ease-in-out infinite',
        pulse:   'pulseRing 2.5s ease-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        pulseRing: {
          '0%':   { boxShadow: '0 0 0 0 rgba(124,58,237,0.7)' },
          '70%':  { boxShadow: '0 0 0 12px rgba(124,58,237,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(124,58,237,0)' },
        },
      },
    },
  },
};
