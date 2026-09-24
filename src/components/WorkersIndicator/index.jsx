import { useMemo, useState } from "react";
import { useWorkerEvents } from "../../hooks/useWorkerEvents";

const WorkersIndicator = ({ total, idle, busy }) => {
  const [workers, setWorkers] = useState({
    total: 0,
    idle: 0,
    busy: 0,
  });

  //subscribe to sse backend endpoint /worker/events 
  useWorkerEvents((workersData) => setWorkers(workersData));

  const stats = useMemo(
    () => [
      { label: "Total", value: workers.total, dotClassName: "bg-slate-400" },
      { label: "Idle", value: workers.idle, dotClassName: "bg-emerald-400" },
      { label: "Busy", value: workers.busy, dotClassName: "bg-amber-400" },
    ],
    [workers],
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-50">Workers</h2>

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
