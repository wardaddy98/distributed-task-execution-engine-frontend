const FilteredTaskItem = ({ task }) => {
  const { id, type, priority, status, createdAt } = task;

  return (
    <article className="h-full space-y-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-semibold text-slate-100">{type}</h3>
        <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-200">
          {status}
        </span>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-slate-400">Priority</dt>
        <dd className="text-slate-200">{priority}</dd>
        <dt className="text-slate-400">Created</dt>
        <dd className="text-slate-200">{new Date(createdAt).toLocaleString()}</dd>
        <dt className="text-slate-400">ID</dt>
        <dd className="break-all font-mono text-slate-200">{id}</dd>
      </dl>
    </article>
  );
};

export default FilteredTaskItem;
