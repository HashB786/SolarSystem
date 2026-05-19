/**
 * SolarSystemViewer.jsx
 * React Three Fiber 3D solar system with procedural canvas textures.
 * Planets orbit the Sun. Click any planet → onPlanetSelect(planet).
 */
import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DoubleSide } from 'three';
import { PLANETS } from '../data/planets';
import { SUN, ASTEROID_BELT } from '../data/planets';

/* ── 3D-specific properties (same order as PLANETS) ── */
const PROPS_3D = [
  { pRadius: 0.28, oRadius: 8,  speed: 4.15,  offset: 0.0 },  // Mercury
  { pRadius: 0.52, oRadius: 12, speed: 1.63,  offset: 1.0 },  // Venus
  { pRadius: 0.60, oRadius: 17, speed: 1.00,  offset: 2.0 },  // Earth
  { pRadius: 0.40, oRadius: 23, speed: 0.532, offset: 3.5 },  // Mars
  { pRadius: 1.55, oRadius: 33, speed: 0.084, offset: 0.8 },  // Jupiter
  { pRadius: 1.30, oRadius: 45, speed: 0.034, offset: 1.8, hasRings: true }, // Saturn
  { pRadius: 0.88, oRadius: 57, speed: 0.012, offset: 2.5 },  // Uranus
  { pRadius: 0.82, oRadius: 68, speed: 0.006, offset: 4.0 },  // Neptune
  { pRadius: 0.18, oRadius: 78, speed: 0.004, offset: 5.0 },  // Pluto
];

export const SOLAR_PLANETS = PLANETS.map((p, i) => ({ ...p, ...PROPS_3D[i] }));

const PLANET_HEX = {
  mercury: '#c0c0c0',
  venus: '#f9e4b7',
  earth: '#1a6ab1',
  mars: '#f4a46a',
  jupiter: '#d4863c',
  saturn: '#f8e7c5',
  uranus: '#5dd0e0',
  neptune: '#2878e0',
  pluto: '#b08878'
};

const SPEED_BASE = 0.21;

/* ── Deterministic pseudo-random (no Math.random so textures are stable) ── */
function sr(seed) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

/* ── Procedural planet texture generator ── */
function generatePlanetTexture(name) {
  const W = 512, H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  switch (name) {
    case 'Mercury': {
      ctx.fillStyle = '#9c9c9c';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 300; i++) {
        const x = sr(i * 7.3) * W, y = sr(i * 13.1) * H, r = sr(i * 3.7) * 20 + 2;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(50,50,50,0.55)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        const g2 = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.1);
        g2.addColorStop(0, 'transparent');
        g2.addColorStop(1, 'rgba(130,130,130,0.2)');
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, y, r * 1.1, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case 'Venus': {
      const gv = ctx.createLinearGradient(0, 0, W, 0);
      gv.addColorStop(0, '#c49020'); gv.addColorStop(0.5, '#eec050'); gv.addColorStop(1, '#c49020');
      ctx.fillStyle = gv; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 25; i++) {
        const y = sr(i * 5.1) * H;
        ctx.strokeStyle = `rgba(255,220,100,${0.08 + sr(i) * 0.14})`;
        ctx.lineWidth = sr(i * 2.2) * 22 + 6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(W * 0.25, y - 30 + sr(i * 3) * 60, W * 0.75, y - 30 + sr(i * 7) * 60, W, y + sr(i * 11) * 40 - 20);
        ctx.stroke();
      }
      break;
    }
    case 'Earth': {
      ctx.fillStyle = '#1a5fa0'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#2d7a3e';
      [
        [W * 0.18, H * 0.32, W * 0.10, H * 0.20, -0.3],
        [W * 0.23, H * 0.65, W * 0.06, H * 0.16, 0.2],
        [W * 0.50, H * 0.38, W * 0.08, H * 0.16, 0],
        [W * 0.53, H * 0.65, W * 0.07, H * 0.18, 0.1],
        [W * 0.70, H * 0.35, W * 0.16, H * 0.18, -0.1],
        [W * 0.80, H * 0.70, W * 0.07, H * 0.10, 0.3],
      ].forEach(([x, y, rx, ry, rot]) => {
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.beginPath(); ctx.ellipse(W * 0.5, 0, W * 0.5, H * 0.07, 0, 0, Math.PI); ctx.fill();
      ctx.beginPath(); ctx.ellipse(W * 0.5, H, W * 0.5, H * 0.05, 0, Math.PI, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 25; i++) {
        const x = sr(i * 7) * W, y = sr(i * 11) * H, r = sr(i * 3) * 50 + 15;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(x, y, r * 2, r * 0.55, sr(i * 5) * Math.PI, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case 'Mars': {
      const gm = ctx.createLinearGradient(0, 0, W, H);
      gm.addColorStop(0, '#d05028'); gm.addColorStop(0.5, '#b03818'); gm.addColorStop(1, '#902810');
      ctx.fillStyle = gm; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 250; i++) {
        const x = sr(i * 5.9) * W, y = sr(i * 9.3) * H, r = sr(i * 2.7) * 14 + 1;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(70,15,5,0.55)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(80,20,5,0.45)'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.5); ctx.lineTo(W * 0.7, H * 0.52); ctx.stroke();
      ctx.fillStyle = 'rgba(255,240,235,0.65)';
      ctx.beginPath(); ctx.ellipse(W * 0.5, 0, W * 0.22, H * 0.06, 0, 0, Math.PI); ctx.fill();
      break;
    }
    case 'Jupiter': {
      const bands = ['#f5cba7','#c87030','#e8a060','#b85820','#f0c090','#c87030','#f8d4a0','#d09040','#f4bf80','#c06820'];
      const bH = H / bands.length;
      bands.forEach((c, i) => {
        const g = ctx.createLinearGradient(0, i * bH, 0, (i + 1) * bH);
        g.addColorStop(0, bands[i]); g.addColorStop(1, bands[(i + 1) % bands.length]);
        ctx.fillStyle = g; ctx.fillRect(0, i * bH, W, bH + 1);
      });
      const grs = ctx.createRadialGradient(W * 0.35, H * 0.62, 0, W * 0.35, H * 0.62, W * 0.07);
      grs.addColorStop(0, 'rgba(170,50,15,0.9)'); grs.addColorStop(0.6, 'rgba(150,45,12,0.6)'); grs.addColorStop(1, 'transparent');
      ctx.fillStyle = grs; ctx.beginPath(); ctx.ellipse(W * 0.35, H * 0.62, W * 0.08, H * 0.11, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'Saturn': {
      const sb = ['#f8e7c5','#d4a853','#ecd080','#c89038','#f4d898','#d0a048','#f0d090','#c89840'];
      const sbH = H / sb.length;
      sb.forEach((c, i) => {
        const g = ctx.createLinearGradient(0, i * sbH, 0, (i + 1) * sbH);
        g.addColorStop(0, sb[i]); g.addColorStop(1, sb[(i + 1) % sb.length]);
        ctx.fillStyle = g; ctx.fillRect(0, i * sbH, W, sbH + 1);
      });
      break;
    }
    case 'Uranus': {
      const gu = ctx.createLinearGradient(0, 0, 0, H);
      gu.addColorStop(0, '#9af0f0'); gu.addColorStop(0.5, '#5dd8e8'); gu.addColorStop(1, '#40c0d0');
      ctx.fillStyle = gu; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 10; i++) {
        const y = sr(i * 3.7) * H;
        ctx.fillStyle = `rgba(255,255,255,${0.02 + sr(i) * 0.04})`;
        ctx.fillRect(0, y, W, H / 20);
      }
      break;
    }
    case 'Neptune': {
      const gn = ctx.createLinearGradient(0, 0, 0, H);
      gn.addColorStop(0, '#4090f0'); gn.addColorStop(0.5, '#1858d0'); gn.addColorStop(1, '#0838a0');
      ctx.fillStyle = gn; ctx.fillRect(0, 0, W, H);
      const storm = ctx.createRadialGradient(W * 0.6, H * 0.38, 0, W * 0.6, H * 0.38, W * 0.06);
      storm.addColorStop(0, 'rgba(5,20,90,0.85)'); storm.addColorStop(1, 'transparent');
      ctx.fillStyle = storm; ctx.beginPath(); ctx.ellipse(W * 0.6, H * 0.38, W * 0.07, H * 0.10, 0.4, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = `rgba(80,120,255,${0.06 + sr(i) * 0.08})`;
        ctx.fillRect(0, sr(i * 7) * H, W, H / 30);
      }
      break;
    }
    case 'Pluto': {
      const gp = ctx.createLinearGradient(0, 0, W, H);
      gp.addColorStop(0, '#c8b0a0'); gp.addColorStop(0.5, '#b09080'); gp.addColorStop(1, '#907060');
      ctx.fillStyle = gp; ctx.fillRect(0, 0, W, H);
      const heart = ctx.createRadialGradient(W * 0.52, H * 0.58, 0, W * 0.52, H * 0.58, W * 0.13);
      heart.addColorStop(0, 'rgba(220,205,190,0.7)'); heart.addColorStop(1, 'transparent');
      ctx.fillStyle = heart; ctx.beginPath(); ctx.ellipse(W * 0.52, H * 0.58, W * 0.14, H * 0.20, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 100; i++) {
        const x = sr(i * 7) * W, y = sr(i * 13) * H;
        ctx.fillStyle = `rgba(80,55,40,${sr(i * 3) * 0.22})`;
        ctx.beginPath(); ctx.arc(x, y, sr(i * 5) * 10 + 1, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    default:
      ctx.fillStyle = '#888'; ctx.fillRect(0, 0, W, H);
  }

  return new THREE.CanvasTexture(canvas);
}

/* ── Sun ── */
function Sun({ onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(SUN); }}
      >
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF8800"
          emissiveIntensity={hovered ? 2.5 : 1.8}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[4.55, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.05} />
      </mesh>
      <pointLight intensity={5} color="#FFF8E0" decay={1} distance={500} />
      {hovered && (
        <Html center position={[0, 6, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: '700',
            color: '#ffffff', background: 'rgba(255,140,0,0.88)',
            padding: '3px 10px', borderRadius: '20px',
            border: '1px solid rgba(255,180,0,0.6)', whiteSpace: 'nowrap',
            boxShadow: '0 0 12px rgba(255,140,0,0.6)',
          }}>The Sun</div>
        </Html>
      )}
    </group>
  );
}

/* ── Orbit path ring ── */
function OrbitPath({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.04, radius + 0.04, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={DoubleSide} />
    </mesh>
  );
}

/* ── Asteroid Belt ── */
function AsteroidBelt({ onSelect }) {
  const [hovered, setHovered] = useState(false);
  const innerR = 25.5, outerR = 30.5;
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(ASTEROID_BELT); }}
      >
        <ringGeometry args={[innerR, outerR, 128]} />
        <meshBasicMaterial color={hovered ? '#d0c090' : '#a09070'} transparent opacity={hovered ? 0.55 : 0.38} side={DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[innerR + 1, outerR - 1, 128]} />
        <meshBasicMaterial color="#c0a870" transparent opacity={0.18} side={DoubleSide} />
      </mesh>
      {hovered && (
        <Html center position={[0, -29, 1]} style={{ pointerEvents: 'none', userSelect: 'none', transform: 'rotate(90deg)' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: '700',
            color: '#ffffff', background: 'rgba(100,80,40,0.9)',
            padding: '3px 10px', borderRadius: '20px',
            border: '1px solid rgba(180,150,80,0.6)', whiteSpace: 'nowrap',
          }}>Asteroid Belt</div>
        </Html>
      )}
    </group>
  );
}

/* ── Individual planet ── */
function Planet({ data, onSelect }) {
  const groupRef = useRef();
  const meshRef  = useRef();
  const angleRef = useRef(data.offset);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => generatePlanetTexture(data.name), [data.name]);

  useFrame((_, delta) => {
    angleRef.current += delta * data.speed * SPEED_BASE;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.oRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * data.oRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(data); }}
      >
        <sphereGeometry args={[data.pRadius, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.0}
          emissive={new THREE.Color(PLANET_HEX[data.color] || '#ffffff')}
          emissiveIntensity={hovered ? 0.25 : 0.02}
        />
      </mesh>

      {/* Hover glow ring */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.pRadius * 1.4, data.pRadius * 1.75, 40]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.75} side={DoubleSide} />
        </mesh>
      )}

      {/* Saturn rings */}
      {data.hasRings && (
        <>
          <mesh rotation={[0.38, 0, 0]}>
            <ringGeometry args={[data.pRadius * 1.5, data.pRadius * 2.05, 64]} />
            <meshBasicMaterial color="#d4b483" transparent opacity={0.6} side={DoubleSide} />
          </mesh>
          <mesh rotation={[0.38, 0, 0]}>
            <ringGeometry args={[data.pRadius * 2.1, data.pRadius * 2.65, 64]} />
            <meshBasicMaterial color="#b89a60" transparent opacity={0.4} side={DoubleSide} />
          </mesh>
        </>
      )}

      {/* Hover label */}
      {hovered && (
        <Html center position={[0, data.pRadius * 2 + 0.8, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: '700',
            color: '#ffffff', background: 'rgba(124,58,237,0.88)',
            padding: '3px 10px', borderRadius: '20px',
            border: '1px solid rgba(124,58,237,0.6)', whiteSpace: 'nowrap',
            boxShadow: '0 0 12px rgba(124,58,237,0.5)',
          }}>
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Canvas wrapper ── */
export default function SolarSystemViewer({ onPlanetSelect }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 55, 100], fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <ambientLight intensity={0.15} />

        <Stars radius={200} depth={70} count={6000} factor={3.5} saturation={0} fade speed={0.5} />

        <Suspense fallback={null}>
          <Sun onSelect={onPlanetSelect} />
          {SOLAR_PLANETS.map(p => (
            <OrbitPath key={`orbit-${p.name}`} radius={p.oRadius} />
          ))}
          <AsteroidBelt onSelect={onPlanetSelect} />
          {SOLAR_PLANETS.map(p => (
            <Planet key={p.name} data={p} onSelect={onPlanetSelect} />
          ))}
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={12}
          maxDistance={170}
          minPolarAngle={Math.PI * 0.05}
          maxPolarAngle={Math.PI * 0.88}
          zoomSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
