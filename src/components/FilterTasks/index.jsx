import { useEffect, useId, useState } from 'react';
import { toast } from 'react-toastify';
import { get } from '../../service/api';
import Button from '../Button';
import FilteredTaskItem from '../FilteredTaskItem';
import Pagination from '../Pagination';

const STATUSES = ['queued', 'running', 'completed', 'cancelled', 'failed', 'dead'];
const TASK_TYPES = ['image_processing', 'report_generation', 'deliberate_fail_task'];
const PRIORITIES = [1, 2, 3, 4, 5];

const INITIAL_QUERY = { status: '', type: '', priority: '', startDate: '', endDate: '' };

const fieldClassName =
  'min-h-10 w-full rounded-md border border-slate-500 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const FilterTasks = () => {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });

  const ids = {
    status: useId(),
    type: useId(),
    priority: useId(),
    startDate: useId(),
    endDate: useId(),
  };

  // GET /task responds with { status, message, body: { data, pagination } }.
  const fetchTasks = async page => {
    try {
      const result = await get('/task', { ...query, page });
      const { data, pagination: { currentPage, totalPages } } = result.body;
      setTasks(data);
      setPagination({ currentPage, totalPages });
    } catch (err) {
      toast.error(err?.message ?? 'Unexpected Error');
    }
  };

  // Fetch on mount and whenever the page changes.
  useEffect(() => {
    fetchTasks(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  const handleChange = event => {
    const { name, value } = event.target;
    setQuery(prev => ({ ...prev, [name]: value }));
  };

  // Apply always starts from page 1; if we're already there, the effect won't re-run, so fetch directly.
  const handleSubmit = event => {
    event.preventDefault();
    if (pagination.currentPage === 1) {
      fetchTasks(1);
    } else {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleReset = () => setQuery(INITIAL_QUERY);

  const handlePrevious = () =>
    setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }));
  const handleNext = () =>
    setPagination(prev => ({
      ...prev,
      currentPage: Math.min(prev.totalPages, prev.currentPage + 1),
    }));

  const selectFields = [
    { name: 'status', label: 'Status', options: STATUSES },
    { name: 'type', label: 'Type', options: TASK_TYPES },
    { name: 'priority', label: 'Priority', options: PRIORITIES },
  ];

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-50">Filter All Tasks</h2>

      <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {selectFields.map(({ name, label, options }) => (
            <div key={name} className="space-y-1.5">
              <label htmlFor={ids[name]} className="block text-sm font-medium text-slate-200">
                {label}
              </label>
              <select
                id={ids[name]}
                name={name}
                value={query[name]}
                onChange={handleChange}
                className={fieldClassName}
              >
                <option value="">Any</option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="space-y-1.5">
            <label htmlFor={ids.startDate} className="block text-sm font-medium text-slate-200">
              Start date
            </label>
            <input
              id={ids.startDate}
              type="date"
              name="startDate"
              value={query.startDate}
              onChange={handleChange}
              className={fieldClassName}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor={ids.endDate} className="block text-sm font-medium text-slate-200">
              End date
            </label>
            <input
              id={ids.endDate}
              type="date"
              name="endDate"
              value={query.endDate}
              onChange={handleChange}
              className={fieldClassName}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-end">
          <Button color="secondary" variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {tasks.length > 0 ? (
        <>
          <ul className="mt-4 grid auto-cols-[minmax(15rem,18rem)] grid-flow-col gap-3 overflow-x-auto pb-2">
            {tasks.map(task => (
              <li key={task.id}>
                <FilteredTaskItem task={task} />
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-slate-400">No tasks found.</p>
      )}
    </section>
  );
};

export default FilterTasks;
