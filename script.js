/**
 * script.js — Space Explorer main JavaScript
 * Handles: Canvas starfield, hamburger menu, dark mode toggle, scroll-to-top,
 *          planet data, card rendering, filter/search, planet modal,
 *          quiz engine, localStorage persistence.
 */

/* === STARFIELD === */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 220;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:             Math.random() * canvas.width,
      y:             Math.random() * canvas.height,
      radius:        Math.random() * 1.6 + 0.2,
      twinkleSpeed:  Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      vx:            (Math.random() - 0.5) * 0.07,
      vy:            (Math.random() - 0.5) * 0.07,
    }));
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    for (const star of stars) {
      const opacity = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(frame * star.twinkleSpeed + star.twinkleOffset));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
      ctx.fill();

      star.x += star.vx;
      star.y += star.vy;
      if (star.x < 0)              star.x = canvas.width;
      if (star.x > canvas.width)   star.x = 0;
      if (star.y < 0)              star.y = canvas.height;
      if (star.y > canvas.height)  star.y = 0;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize();
  createStars();
  draw();
}

/* === HAMBURGER MENU === */
function initHamburger() {
  const btn  = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* === DARK MODE === */
function initDarkMode() {
  const saved = localStorage.getItem('spaceMode');
  if (saved === 'light') document.body.classList.add('light-mode');

  document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
    btn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const light = document.body.classList.contains('light-mode');
      localStorage.setItem('spaceMode', light ? 'light' : 'dark');
      document.querySelectorAll('.dark-mode-toggle').forEach(b => {
        b.textContent = light ? '🌙' : '☀️';
      });
    });
  });
}

/* === SCROLL TO TOP === */
function initScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* === PLANET DATA === */
const PLANETS = [
  {
    name: 'Mercury', type: 'inner', color: 'mercury',
    diameter: '4,879 km', moons: 0, distance: '57.9M km',
    temp: '-180°C to 430°C', orbitPeriod: '88 days', gravity: '3.7 m/s²',
    description: 'The smallest planet in our solar system and closest to the Sun. Without an atmosphere to retain heat, surface temperatures swing dramatically between scorching days and freezing nights.',
    funFact: 'A single day on Mercury (sunrise to sunrise) lasts 176 Earth days — longer than its 88-day year!',
  },
  {
    name: 'Venus', type: 'inner', color: 'venus',
    diameter: '12,104 km', moons: 0, distance: '108.2M km',
    temp: '465°C avg', orbitPeriod: '225 days', gravity: '8.87 m/s²',
    description: 'The hottest planet in our solar system due to a runaway greenhouse effect. Thick clouds of sulfuric acid trap heat, making its surface hotter than Mercury despite being farther from the Sun.',
    funFact: 'Venus spins backwards compared to most planets — on Venus the Sun rises in the west and sets in the east!',
  },
  {
    name: 'Earth', type: 'inner', color: 'earth',
    diameter: '12,756 km', moons: 1, distance: '149.6M km',
    temp: '15°C avg', orbitPeriod: '365 days', gravity: '9.8 m/s²',
    description: 'The only known planet with life. 71% of the surface is covered in liquid water, and a protective magnetic field shields life from harmful solar radiation.',
    funFact: 'Earth is the densest planet in the solar system, with an average density of 5.5 g/cm³.',
  },
  {
    name: 'Mars', type: 'inner', color: 'mars',
    diameter: '6,792 km', moons: 2, distance: '227.9M km',
    temp: '-60°C avg', orbitPeriod: '687 days', gravity: '3.72 m/s²',
    description: 'The Red Planet, home to Olympus Mons — the tallest volcano in the solar system at 21 km high. Mars has seasons similar to Earth and evidence of ancient liquid water.',
    funFact: 'Dust storms on Mars can engulf the entire planet and last for months, blocking out sunlight almost completely!',
  },
  {
    name: 'Jupiter', type: 'outer', color: 'jupiter',
    diameter: '142,984 km', moons: 95, distance: '778.5M km',
    temp: '-110°C avg', orbitPeriod: '12 years', gravity: '24.79 m/s²',
    description: 'The largest planet in the solar system — so massive that all other planets combined would fit inside it twice over. The Great Red Spot storm has raged for over 350 years.',
    funFact: "Jupiter's mass is more than twice that of all other planets combined!",
  },
  {
    name: 'Saturn', type: 'outer', color: 'saturn', hasRings: true,
    diameter: '120,536 km', moons: 146, distance: '1.43B km',
    temp: '-140°C avg', orbitPeriod: '29 years', gravity: '10.44 m/s²',
    description: 'Famous for its spectacular ring system made of ice and rock, spanning 282,000 km yet only about 20 meters thick in places. Saturn has 146 known moons — more than any other planet.',
    funFact: "Saturn would float on water — it's the only planet in the solar system less dense than water!",
  },
  {
    name: 'Uranus', type: 'outer', color: 'uranus',
    diameter: '51,118 km', moons: 27, distance: '2.87B km',
    temp: '-195°C avg', orbitPeriod: '84 years', gravity: '8.69 m/s²',
    description: 'Rotates on its side at a 98° axial tilt, likely the result of a massive ancient collision. This means its poles experience 42 consecutive years of sunlight followed by 42 years of darkness.',
    funFact: 'Uranus was the first planet discovered with a telescope, spotted by astronomer William Herschel in 1781!',
  },
  {
    name: 'Neptune', type: 'outer', color: 'neptune',
    diameter: '49,528 km', moons: 16, distance: '4.5B km',
    temp: '-200°C avg', orbitPeriod: '165 years', gravity: '11.15 m/s²',
    description: 'The windiest planet in the solar system, with speeds reaching 2,100 km/h. Neptune was discovered through mathematics — its gravitational influence on Uranus revealed its existence before it was seen.',
    funFact: 'Neptune takes 165 Earth years to orbit the Sun — it has only completed one full orbit since its discovery in 1846!',
  },
  {
    name: 'Pluto', type: 'dwarf', color: 'pluto',
    diameter: '2,376 km', moons: 5, distance: '5.9B km',
    temp: '-230°C avg', orbitPeriod: '248 years', gravity: '0.62 m/s²',
    description: 'Reclassified as a dwarf planet by the IAU in 2006. Despite its small size, Pluto has a complex geology including a heart-shaped nitrogen ice plain called Tombaugh Regio.',
    funFact: "Pluto's largest moon Charon is so massive relative to Pluto that the two orbit a shared point in space — making them a binary system!",
  },
];

/* === PLANET CARD RENDERING === */
function buildPlanetGraphic(planet, size = 80) {
  if (planet.hasRings) {
    return `
      <div class="saturn-ring-wrapper" style="width:${size + 20}px;height:${size + 20}px;margin:0 auto 1rem;">
        <div class="planet-graphic planet-${planet.color}" style="width:${size}px;height:${size}px;"></div>
        <div class="saturn-ring"></div>
      </div>`;
  }
  return `<div class="planet-graphic planet-${planet.color} float-anim" style="width:${size}px;height:${size}px;margin:0 auto 1rem;"></div>`;
}

function renderPlanetCards(planets) {
  const grid = document.getElementById('planet-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (planets.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-20 text-gray-500">
        <div class="text-5xl mb-4">🔭</div>
        <p class="font-heading text-lg">No planets found</p>
        <p class="text-sm mt-2 text-gray-600">Try a different search or filter</p>
      </div>`;
    return;
  }

  planets.forEach((planet, i) => {
    const card = document.createElement('article');
    card.className = `glass-card glow-card cursor-pointer fade-in-up delay-${(i % 6) + 1} p-6`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${planet.name}`);

    const typeLabel = planet.type.charAt(0).toUpperCase() + planet.type.slice(1);
    card.innerHTML = `
      ${buildPlanetGraphic(planet, 80)}
      <div class="text-center mb-4">
        <h3 class="font-heading text-xl font-bold text-white mb-2">${planet.name}</h3>
        <span class="badge badge-${planet.type}">${typeLabel}</span>
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <span class="stat-chip">⬤ ${planet.diameter}</span>
        <span class="stat-chip">🌙 ${planet.moons} moon${planet.moons !== 1 ? 's' : ''}</span>
        <span class="stat-chip">☀️ ${planet.distance}</span>
      </div>
    `;

    const open = () => openPlanetModal(planet);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });
    grid.appendChild(card);
  });
}

/* === PLANET MODAL === */
function openPlanetModal(planet) {
  const modal = document.getElementById('planet-modal');
  const body  = document.getElementById('modal-body');
  if (!modal || !body) return;

  const typeLabel = planet.type.charAt(0).toUpperCase() + planet.type.slice(1);
  body.innerHTML = `
    <div class="p-6 md:p-8">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="font-heading text-2xl md:text-3xl font-black text-white glow-heading">${planet.name}</h2>
          <span class="badge badge-${planet.type} mt-2">${typeLabel} Planet</span>
        </div>
        <button id="modal-close" class="text-gray-400 hover:text-white transition-colors text-3xl leading-none ml-4 mt-1" aria-label="Close modal">✕</button>
      </div>

      ${buildPlanetGraphic(planet, 100)}

      <p class="text-gray-300 leading-relaxed mb-6">${planet.description}</p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        ${[
          ['DIAMETER',     planet.diameter],
          ['MOONS',        planet.moons],
          ['DISTANCE',     planet.distance],
          ['AVG TEMP',     planet.temp],
          ['ORBIT PERIOD', planet.orbitPeriod],
          ['GRAVITY',      planet.gravity],
        ].map(([label, val]) => `
          <div class="glass-card p-3 text-center">
            <div class="text-yellow-400 font-heading text-xs mb-1">${label}</div>
            <div class="text-white font-semibold text-sm">${val}</div>
          </div>`).join('')}
      </div>

      <div class="rounded-xl p-4" style="border:1px solid rgba(245,158,11,0.35);background:rgba(245,158,11,0.06);">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-yellow-400 text-lg">💡</span>
          <span class="font-heading text-yellow-400 text-xs font-bold tracking-widest">FUN FACT</span>
        </div>
        <p class="text-gray-200 text-sm leading-relaxed">${planet.funFact}</p>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  document.getElementById('modal-close').addEventListener('click', closePlanetModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closePlanetModal(); });
}

function closePlanetModal() {
  const modal = document.getElementById('planet-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/* === PLANETS PAGE — FILTER & SEARCH === */
function initPlanetsPage() {
  if (!document.getElementById('planet-grid')) return;

  let currentFilter = 'all';
  let currentSearch = '';

  function applyFilters() {
    let result = PLANETS;
    if (currentFilter !== 'all') result = result.filter(p => p.type === currentFilter);
    if (currentSearch)           result = result.filter(p => p.name.toLowerCase().includes(currentSearch.toLowerCase()));
    renderPlanetCards(result);
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  const searchInput = document.getElementById('planet-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      applyFilters();
    });
  }

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePlanetModal();
  });

  applyFilters();
}

/* === QUIZ DATA === */
const QUIZ_QUESTIONS = [
  {
    question: 'Which is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'],
    correct: 1,
  },
  {
    question: 'How many moons does Mars have?',
    options: ['0', '1', '2', '3'],
    correct: 2,
  },
  {
    question: 'What is the hottest planet in our solar system?',
    options: ['Mercury', 'Mars', 'Jupiter', 'Venus'],
    correct: 3,
  },
  {
    question: 'Which planet has the most known moons?',
    options: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'],
    correct: 2,
  },
  {
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    correct: 1,
  },
  {
    question: 'Which planet rotates on its side with a 98° axial tilt?',
    options: ['Neptune', 'Pluto', 'Saturn', 'Uranus'],
    correct: 3,
  },
  {
    question: 'What is the smallest planet in our solar system?',
    options: ['Mars', 'Mercury', 'Pluto', 'Venus'],
    correct: 1,
  },
  {
    question: 'How long does light from the Sun take to reach Earth?',
    options: ['1 second', '1 hour', '8 minutes', '1 day'],
    correct: 2,
  },
  {
    question: 'Which planet has the Great Red Spot storm?',
    options: ['Saturn', 'Neptune', 'Jupiter', 'Mars'],
    correct: 2,
  },
  {
    question: 'What year was Pluto reclassified as a dwarf planet?',
    options: ['1999', '2001', '2012', '2006'],
    correct: 3,
  },
];

/* === QUIZ STATE === */
let quizState = { current: 0, score: 0, answered: false };

/* === QUIZ LOGIC === */
function initQuiz() {
  const container = document.getElementById('quiz-container');
  const results   = document.getElementById('results-container');
  if (!container) return;

  quizState = { current: 0, score: 0, answered: false };
  if (results) results.classList.add('hidden');
  container.classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const q       = QUIZ_QUESTIONS[quizState.current];
  const total   = QUIZ_QUESTIONS.length;
  const pctDone = (quizState.current / total) * 100;

  container.innerHTML = `
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-400 mb-2 font-heading">
        <span>Question ${quizState.current + 1} of ${total}</span>
        <span style="color:#f59e0b;">Score: ${quizState.score}</span>
      </div>
      <div class="w-full rounded-full overflow-hidden" style="height:8px;background:rgba(255,255,255,0.08);">
        <div class="quiz-progress-bar" style="height:8px;width:${pctDone}%;"></div>
      </div>
    </div>

    <div class="glass-card p-5 md:p-6 mb-6">
      <p class="text-xs font-heading tracking-widest mb-3" style="color:#7c3aed;">QUESTION ${quizState.current + 1}</p>
      <h3 class="font-heading text-lg md:text-xl font-bold text-white leading-snug">${q.question}</h3>
    </div>

    <div class="space-y-3" id="options-container">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;border:1px solid rgba(124,58,237,0.5);font-size:0.8rem;font-weight:700;color:#7c3aed;margin-right:0.75rem;flex-shrink:0;">${String.fromCharCode(65 + i)}</span>
          ${opt}
        </button>`).join('')}
    </div>
  `;

  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.index)));
  });
}

function selectAnswer(selected) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q       = QUIZ_QUESTIONS[quizState.current];
  const buttons = document.querySelectorAll('.quiz-option');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });

  if (selected === q.correct) quizState.score++;

  setTimeout(() => {
    quizState.current++;
    quizState.answered = false;
    if (quizState.current < QUIZ_QUESTIONS.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1300);
}

function showResults() {
  const container = document.getElementById('quiz-container');
  const results   = document.getElementById('results-container');
  if (!results) return;

  container.classList.add('hidden');
  results.classList.remove('hidden');

  const score = quizState.score;
  const total = QUIZ_QUESTIONS.length;
  const pct   = Math.round((score / total) * 100);

  // Save high score
  const prev = parseInt(localStorage.getItem('spaceHighScore') || '0');
  if (score > prev) localStorage.setItem('spaceHighScore', score);
  const highScore = parseInt(localStorage.getItem('spaceHighScore'));
  const isNewHigh = score > prev;

  let emoji, message, messageColor;
  if (pct >= 90) { emoji = '🏆'; message = 'Space Genius!';        messageColor = '#f59e0b'; }
  else if (pct >= 60) { emoji = '🌟'; message = 'Not Bad, Cadet!'; messageColor = '#7c3aed'; }
  else { emoji = '📚'; message = 'Keep Studying, Explorer!';        messageColor = '#60a5fa'; }

  results.innerHTML = `
    <div class="text-center py-6">
      <div class="text-6xl mb-4">${emoji}</div>
      <h2 class="font-heading text-2xl md:text-3xl font-black mb-3" style="color:${messageColor};text-shadow:0 0 20px ${messageColor}88;">${message}</h2>
      <p class="text-gray-400 mb-6 text-lg">You scored <strong class="text-white">${score}</strong> out of <strong class="text-white">${total}</strong></p>

      <div class="w-full rounded-full overflow-hidden mb-2" style="height:12px;background:rgba(255,255,255,0.08);">
        <div class="quiz-progress-bar" style="height:12px;width:${pct}%;"></div>
      </div>
      <p class="text-sm text-gray-500 mb-8">${pct}% correct</p>

      <div class="glass-card inline-block px-6 py-3 mb-2">
        <span class="text-gray-400 text-sm font-heading">🏅 HIGH SCORE: </span>
        <span class="font-heading font-black text-lg" style="color:#f59e0b;">${highScore}/${total}</span>
        ${isNewHigh ? '<span class="ml-2 text-xs font-heading" style="color:#22c55e;">NEW BEST!</span>' : ''}
      </div>

      <div class="mt-8">
        <button onclick="initQuiz()" class="glow-btn font-heading font-bold py-3 px-10 rounded-xl transition-all text-white" style="background:linear-gradient(135deg,#7c3aed,#a855f7);">
          🔄 Try Again
        </button>
      </div>
    </div>
  `;
}

/* === INIT ALL MODULES === */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initHamburger();
  initDarkMode();
  initScrollToTop();
  initPlanetsPage();
  initQuiz();
});
