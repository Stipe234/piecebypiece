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
    <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,rgba(255,255,255,0.7)_0%,rgba(247,228,212,0.55)_100%)] p-6 shadow-[0_25px_60px_-35px_rgba(120,60,70,0.4)] backdrop-blur-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c48a78]/20 blur-3xl"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#a06b5a]">Last 30 days</p>
          <p className="mt-2 font-heading text-2xl font-light text-[#3a222a]">
            {totalLabel} <span className="text-[#a06b5a]">·</span> {totalOrders} order{totalOrders === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative mt-4 h-28 w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="pbp-spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c48a78" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c48a78" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#pbp-spark)" />
        <path d={path} fill="none" stroke="#8a4a52" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
