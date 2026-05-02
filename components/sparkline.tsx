interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

/** Tiny inline sparkline. SVG, no deps, no animation that fights motion-reduce. */
export function Sparkline({ values, width = 96, height = 28, className }: SparklineProps) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 2) - 1}`)
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      role="img"
      aria-label="Latency sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <polyline
        points={areaPoints}
        fill="hsl(var(--brand) / 0.12)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--brand))"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((v, i) => {
        const x = i * step;
        const y = height - ((v - min) / range) * (height - 2) - 1;
        return (
          <circle key={i} cx={x} cy={y} r="1.5" fill="hsl(var(--brand))" />
        );
      })}
    </svg>
  );
}
