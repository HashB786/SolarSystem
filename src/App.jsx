import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ScrollToTopOnNavigate, ScrollToTopButton } from './components/ScrollToTop';
import Home from './pages/Home';
import Planets from './pages/Planets';
import SolarSystem from './pages/SolarSystem';
import Quiz from './pages/Quiz';
import About from './pages/About';
import Cosmo from './pages/Cosmo';

function AnimatedRoutes() {
  const location = useLocation();
  const isSolar  = location.pathname === '/solar-system';

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"             element={<Home />} />
          <Route path="/planets"      element={<Planets />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/quiz"         element={<Quiz />} />
          <Route path="/cosmo"        element={<Cosmo />} />
          <Route path="/about"        element={<About />} />
        </Routes>
      </AnimatePresence>

      {!isSolar && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <StarfieldConditional />
      <Navbar />
      <ScrollToTopOnNavigate />
      <AnimatedRoutes />
      <ScrollToTopButton />
    </HashRouter>
  );
}

function StarfieldConditional() {
  const { pathname } = useLocation();
  if (pathname === '/solar-system') return null;
  return <Starfield />;
}
