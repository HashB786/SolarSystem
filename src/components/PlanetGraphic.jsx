export default function PlanetGraphic({ planet, size = 80 }) {
  const sphere = (
    <div
      className={`planet-base planet-${planet.color}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${planet.name} illustration`}
    />
  );

  if (!planet.hasRings) {
    return sphere;
  }

  return (
    <div
      className="saturn-ring-wrapper"
      style={{ width: size * 1.7, height: size * 1.4 }}
    >
      {sphere}
      <div
        className="saturn-ring"
        style={{ borderWidth: Math.max(6, size * 0.045) }}
      />
    </div>
  );
}
