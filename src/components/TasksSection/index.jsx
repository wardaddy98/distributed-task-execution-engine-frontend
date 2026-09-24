import { useId } from 'react';
import { DUMMY_TASKS } from '../../utils/dummyTasks';
import TaskCard from '../TaskCard';

const COLUMNS = [
  { status: 'running', title: 'Running' },
  { status: 'queued', title: 'Queued' },
  { status: 'failed', title: 'Failed' },
  { status: 'dead', title: 'Dead' },
  { status: 'completed', title: 'Completed' },
];

const TasksSection = ({ tasks = DUMMY_TASKS }) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6"
    >
      <h2 id={headingId} className="text-lg font-semibold text-slate-50">
        Tasks
      </h2>

      <div

        className="relative mt-4 grid auto-cols-[minmax(13rem,1fr)] grid-flow-col gap-4 overflow-x-auto rounded-lg pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {COLUMNS.map(({ status, title }) => {
          const columnTasks = tasks.filter(task => task.status === status);

          return (
            <div key={status} className="flex flex-col rounded-lg bg-slate-950/50 p-3">
              <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-200">
                {title}
                <span
                  aria-hidden="true"
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                >
                  {columnTasks.length}
                </span>
                <span className="sr-only">, {columnTasks.length} tasks</span>
              </h3>

              {columnTasks.length ? (
                <ul className="space-y-3">
                  {columnTasks.map(task => (
                    <li key={task.id}>
                      {/* TODO: wire cancel and retry to the backend. */}
                      <TaskCard task={task} onCancel={() => {}} onRetry={() => {}} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">No tasks</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TasksSection;
