const WorkersIndicator = ({ total, idle, busy }) => {
  const stats = [
    { label: 'Total', value: total, dotClassName: 'bg-slate-400' },
    { label: 'Idle', value: idle, dotClassName: 'bg-emerald-400' },
    { label: 'Busy', value: busy, dotClassName: 'bg-amber-400' },
  ];

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-slate-50">
        Workers
      </h2>

      <dl className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1">
        {stats.map(({ label, value, dotClassName }) => (
          <div
            key={label}
            className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 lg:flex lg:items-center lg:justify-between"
          >
            <dt className="flex items-center gap-2 text-sm text-slate-400">
              <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-50 lg:mt-0">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default WorkersIndicator;
