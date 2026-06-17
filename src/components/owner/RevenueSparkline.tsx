interface Point {
  date: string;
  revenueCents: number;
  orderCount: number;
}

interface Props {
  series: Point[];
}

export default function RevenueSparkline({ series }: Props) {
  if (series.length === 0) {
    return null;
  }

  const width = 600;
  const height = 120;
  const padding = 6;
  const max = Math.max(...series.map((p) => p.revenueCents), 1);
  const stepX = (width - padding * 2) / Math.max(series.length - 1, 1);

  const points = series.map((point, i) => {
    const x = padding + stepX * i;
    const y = height - padding - (point.revenueCents / max) * (height - padding * 2);
    return { x, y, point };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    `${path} L${points[points.length - 1].x.toFixed(1)} ${height - padding} ` +
    `L${points[0].x.toFixed(1)} ${height - padding} Z`;

  const totalCents = series.reduce((sum, p) => sum + p.revenueCents, 0);
  const totalOrders = series.reduce((sum, p) => sum + p.orderCount, 0);
  const totalLabel = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(totalCents / 100);

  return (
    <div className="dash-card rounded-2xl p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="dash-accent" aria-hidden />
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-gold)]">Last 30 days</p>
          </div>
          <p className="mt-3 font-numeric text-2xl font-medium text-[var(--color-text-primary)]">
            {totalLabel} <span className="text-[var(--color-text-tertiary)]">·</span> {totalOrders} order{totalOrders === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-5 h-28 w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="pbp-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#pbp-spark)" />
        <path d={path} fill="none" stroke="#B5904F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
