import { useLayoutEffect, useState } from "react";
import { useTaskEvents } from "../../hooks/useTaskEvents";
import TaskCard from "../TaskCard";
import { get, patch } from "../../service/api";
import { toast } from "react-toastify";

const COLUMNS = [
  { status: "running", title: "Running" },
  { status: "queued", title: "Queued" },
  { status: "failed", title: "Failed" },
  { status: "dead", title: "Dead" },
  { status: "completed", title: "Completed" },
  { status: "cancelled", title: "Cancelled" },
];


const TasksSection = () => {
  const [tasks, setTasks] = useState([]);

  // Live updates: replace the task if we already have it, otherwise add it to the top.
  useTaskEvents((task) =>
    setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]),
  );

  useLayoutEffect(() => {
    getAllTasks();
  }, []);

  async function getAllTasks() {
    try {
      const result = await get("/task/all");
      setTasks(result?.body ?? []);
    } catch (err) {
      toast.error(err?.message ?? "Unexpected Error");
    }
  }

  const handleCancel = async (taskId) => {
    try {
      const result = await patch(`/task/cancel/${taskId}`);
      toast.success(result?.message)
    } catch (err) {
      toast.error(err?.message ?? "Unexpected Error");
    }
  };

  const handleRetry = async (taskId) => {
    try {
      const result = await patch(`/task/retry/${taskId}`);
      toast.success(result?.message)
    } catch (err) {
      toast.error(err?.message ?? "Unexpected Error");
    }
  };

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-slate-50">
        {
          `Tasks (${tasks.length})`
        }
      </h2>

      <div className="mt-4 grid auto-cols-[minmax(13rem,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2">
        {COLUMNS.map(({ status, title }) => {
          const columnTasks = tasks.filter(task => task.status === status);

          return (
            <div key={status} className="flex flex-col rounded-lg bg-slate-950/50 p-3">
              <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-200">
                {title}
                <span
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                >
                  {columnTasks.length}
                </span>
              </h3>

              {columnTasks.length ? (
                <ul className="space-y-3">
                  {columnTasks.map(task => (
                    <li key={task.id}>
                      <TaskCard task={task} onCancel={handleCancel} onRetry={handleRetry} />
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
