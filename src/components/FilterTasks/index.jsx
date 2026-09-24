import { useEffect, useId, useState } from 'react';
import { toast } from 'react-toastify';
import { DUMMY_TASKS } from '../../utils/dummyTasks';
import Button from '../Button';
import FilteredTaskItem from '../FilteredTaskItem';
import Pagination from '../Pagination';

const STATUSES = ['queued', 'running', 'completed', 'cancelled', 'failed', 'dead'];
const TASK_TYPES = ['image_processing', 'report_generation'];
const PRIORITIES = [1, 2, 3, 4, 5];

const INITIAL_FILTERS = { status: '', type: '', priority: '', startDate: '', endDate: '' };

const fieldClassName =
  'min-h-10 w-full rounded-md border border-slate-500 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

// Dates are inclusive: startDate from 00:00, endDate until 23:59:59 (local time).
const matchesFilters = (task, filters) => {
  const createdAt = new Date(task.createdAt);
  return (
    (!filters.status || task.status === filters.status) &&
    (!filters.type || task.type === filters.type) &&
    (!filters.priority || task.priority === Number(filters.priority)) &&
    (!filters.startDate || createdAt >= new Date(`${filters.startDate}T00:00:00`)) &&
    (!filters.endDate || createdAt <= new Date(`${filters.endDate}T23:59:59.999`))
  );
};

const PAGE_SIZE = 5;

// Client-side stand-in for GET /task; returns the same shape as the backend's paginated response.
const queryTasks = (tasks, filters, page) => {
  const matched = tasks.filter(task => matchesFilters(task, filters));
  return {
    data: matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    pagination: {
      totalCount: matched.length,
      totalPages: Math.max(1, Math.ceil(matched.length / PAGE_SIZE)),
      currentPage: page,
    },
  };
};

const FilterTasks = ({ tasks = DUMMY_TASKS }) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  // Filters from the last Apply; page changes re-query with these, not the unsaved form values.
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [result, setResult] = useState(null);

  // Re-query whenever the applied filters or the page change.
  useEffect(() => {
    // TODO: call GET /task with appliedFilters, page and limit=PAGE_SIZE (the backend defaults to 10)
    // as query params instead. Send the dates as ISO instants (local start/end of day); the backend
    // parses YYYY-MM-DD as UTC midnight. Ignore responses from stale requests when this becomes async.
    const next = queryTasks(tasks, appliedFilters, currentPage);
    const { totalPages } = next.pagination;

    // If the results shrank, go back to the last page that exists instead of showing an empty page.
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
      return;
    }
    setResult(next);
  }, [tasks, appliedFilters, currentPage]);
  const ids = {
    status: useId(),
    type: useId(),
    priority: useId(),
    startDate: useId(),
    endDate: useId(),
  };

  const isDateRangeInvalid =
    Boolean(filters.startDate && filters.endDate) && filters.startDate > filters.endDate;

  const handleChange = event => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (isDateRangeInvalid) {
      setResult(null);
      return toast.error('Start date must be on or before end date');
    }

    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const handlePrevious = () => setCurrentPage(page => Math.max(1, page - 1));
  const handleNext = () =>
    setCurrentPage(page => Math.min(result?.pagination.totalPages ?? page, page + 1));

  const selectFields = [
    { name: 'status', label: 'Status', options: STATUSES },
    { name: 'type', label: 'Type', options: TASK_TYPES },
    { name: 'priority', label: 'Priority', options: PRIORITIES },
  ];

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-slate-50">
        Filter All Tasks
      </h2>

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
                value={filters[name]}
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
              value={filters.startDate}
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
              value={filters.endDate}
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

      <p className="mt-4 text-sm text-slate-400">
        {result === null
          ? 'Choose filters and apply them to find tasks.'
          : `${result.pagination.totalCount} ${
              result.pagination.totalCount === 1 ? 'task matches' : 'tasks match'
            }.`}
      </p>

      {result?.data.length > 0 && (
        <>
          <ul className="relative mt-3 grid auto-cols-[minmax(15rem,18rem)] grid-flow-col gap-3 overflow-x-auto pb-2">
            {result.data.map(task => (
              <li key={task.id}>
                <FilteredTaskItem task={task} />
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <Pagination
              currentPage={result.pagination.currentPage}
              totalPages={result.pagination.totalPages}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default FilterTasks;
