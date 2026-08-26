export default function Sparkline({ points, width = 280, height = 72 }) {
  if (!points?.length) return null;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 6;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const coords = points.map((p, i) => {
    const x = pad + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = pad + innerH - ((p.value - min) / span) * innerH;
    return { x, y, outlier: p.outlier };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Series sparkline">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={c.outlier ? 4.5 : 2.5}
          fill={c.outlier ? "var(--danger)" : "var(--accent-strong)"}
        />
      ))}
    </svg>
  );
}
