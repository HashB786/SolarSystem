const FACTS = [
  { label: 'Mercury', text: 'has no moons' },
  { label: 'Jupiter', text: 'has 95 known moons' },
  { label: 'Saturn',  text: 'could float on water' },
  { label: 'Light',   text: 'takes 8 minutes to reach Earth from the Sun' },
  { label: 'Olympus Mons', text: 'on Mars stands 21 km tall' },
  { label: 'Venus',   text: 'rotates backwards — the Sun rises in the west' },
  { label: "Neptune's", text: 'winds reach 2,100 km/h' },
  { label: 'Uranus',  text: 'rotates on its side at 98°' },
];

export default function MarqueeTicker() {
  // Duplicate for seamless loop (animation runs to -50%)
  const doubled = [...FACTS, ...FACTS];

  return (
    <section className="marquee-wrapper" aria-label="Space facts ticker">
      <div className="marquee-track animate-marquee py-2.5 text-sm text-gray-300">
        <span className="inline-flex gap-10 px-8">
          {doubled.map((f, i) => (
            <span key={i}>
              ✦{' '}
              <strong className="text-yellow-400">{f.label}</strong>{' '}
              {f.text}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
