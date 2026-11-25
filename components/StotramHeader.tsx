import Link from "next/link";

// The "cover art" band at the top of stotram and verse pages: deity gradient, big type, stats.
export function StotramHeader({
  kicker,
  sa,
  title,
  byline,
  stats,
  children,
}: {
  kicker: string;
  sa: string;
  title: string;
  byline?: string;
  stats?: [value: string, label: string][];
  children?: React.ReactNode;
}) {
  return (
    <header className="deity-band text-white">
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">{kicker}</p>
        <p className="mt-4 font-sanskrit text-[clamp(2.2rem,6vw,4.2rem)] leading-tight" lang="sa">
          {sa}
        </p>
        <h1 className="mt-1 text-[clamp(1.9rem,4.5vw,3.4rem)] font-extrabold leading-[1.05] tracking-tight">{title}</h1>
        {byline && <p className="mt-3 text-white/70">{byline}</p>}
        {stats && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
            {stats.map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-extrabold">{value}</dd>
                <span aria-hidden className="text-sm text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </dl>
        )}
        {children}
      </div>
    </header>
  );
}

export function HeaderPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-white/10 px-3 py-1 font-medium text-white backdrop-blur transition-colors hover:bg-white hover:text-deity-deep"
    >
      {children}
    </Link>
  );
}
