import Button from '../Button';

const MAX_RETRIES = 3;

const TaskCard = ({ task, onCancel, onRetry }) => {
  const { id, type, priority, status, progress, retries, createdAt } = task;
  const canCancel = status === 'running' || status === 'queued';
  const canRetry = status === 'dead' || status === 'cancelled';
  const createdTime = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="relative flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-100">
          P{priority} · #{id.slice(0, 8)} · {createdTime}
        </h4>
        <p className="break-words text-xs text-slate-400">{type}</p>
      </div>

      {status === 'running' && (
        <div className="flex items-center gap-2">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"
          >
            <div className="h-full rounded-full bg-sky-400" style={{ width: `${progress}%` }} />
          </div>
          <span className="w-9 text-right text-xs tabular-nums text-slate-300">{progress}%</span>
        </div>
      )}

      {status === 'failed' && (
        <p className="text-xs text-amber-300">
          Retrying · attempt {retries} of {MAX_RETRIES}
        </p>
      )}

      {status === 'dead' && (
        <p className="text-xs text-rose-300">Failed after {MAX_RETRIES} retries</p>
      )}

      {canCancel && (
        <div className="mt-auto flex justify-end">
          <Button color="secondary" variant="outlined" onClick={() => onCancel(id)}>
            Cancel
          </Button>
        </div>
      )}

      {canRetry && (
        <div className="mt-auto flex justify-end">
          <Button variant="outlined" onClick={() => onRetry(id)}>
            Retry
          </Button>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
