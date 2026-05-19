import { useEffect, useRef } from 'react';

const STAR_COUNT = 240;

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let stars    = [];
    let animId;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x:             Math.random() * canvas.width,
        y:             Math.random() * canvas.height,
        radius:        Math.random() * 1.7 + 0.2,
        twinkleSpeed:  Math.random() * 0.022 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx:            (Math.random() - 0.5) * 0.06,
        vy:            (Math.random() - 0.5) * 0.06,
      }));
    }

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (const s of stars) {
        // Sine-wave opacity for twinkling
        const opacity = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        ctx.fill();

        // Slow drift, wrap edges
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0)             s.x = canvas.width;
        if (s.x > canvas.width)  s.x = 0;
        if (s.y < 0)             s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
      }

      animId = requestAnimationFrame(draw);
    }

    function onResize() {
      resize();
      createStars();
    }

    window.addEventListener('resize', onResize);
    resize();
    createStars();
    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
