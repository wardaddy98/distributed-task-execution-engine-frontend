import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import FilterTasks from '.';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

const makeTask = (id, overrides) => ({
  id: `${id}0000000-0000-0000-0000-000000000000`,
  type: 'image_processing',
  priority: 3,
  status: 'queued',
  progress: 0,
  retries: 0,
  createdAt: '2026-09-20T10:00:00',
  ...overrides,
});

const tasks = [
  makeTask(1, { status: 'running', priority: 5 }),
  makeTask(2, { status: 'queued', type: 'report_generation', createdAt: '2026-09-22T10:00:00' }),
  makeTask(3, { status: 'dead', priority: 1, createdAt: '2026-09-24T23:30:00' }),
];

const apply = () => userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
const setDate = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => {
  toast.error.mockClear();
});

test('renders the heading and all filter fields', () => {
  render(<FilterTasks tasks={tasks} />);
  expect(screen.getByRole('region', { name: 'Filter All Tasks' })).toBeInTheDocument();
  ['Status', 'Type', 'Priority'].forEach(name =>
    expect(screen.getByRole('combobox', { name })).toHaveValue(''),
  );
  expect(screen.getByLabelText('Start date')).toHaveAttribute('type', 'date');
  expect(screen.getByLabelText('End date')).toHaveAttribute('type', 'date');
});

test('shows status, type and priority options as-is', () => {
  render(<FilterTasks tasks={tasks} />);
  ['dead', 'cancelled', 'report_generation', '5'].forEach(name =>
    expect(screen.getByRole('option', { name })).toBeInTheDocument(),
  );
});

test('shows all tasks before any filter is applied', () => {
  render(<FilterTasks tasks={tasks} />);
  expect(screen.getByText('3 tasks match.')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

test('matches every task when no filters are set', () => {
  render(<FilterTasks tasks={tasks} />);
  apply();
  expect(screen.getByText('3 tasks match.')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

test('filters by status, type and priority together', () => {
  render(<FilterTasks tasks={tasks} />);
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'queued');
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Type' }), 'report_generation');
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Priority' }), '3');
  apply();
  expect(screen.getByText('1 task matches.')).toBeInTheDocument();
});

test('filters by an inclusive date range', () => {
  render(<FilterTasks tasks={tasks} />);
  setDate('Start date', '2026-09-22');
  setDate('End date', '2026-09-24');
  apply();
  expect(screen.getByText('2 tasks match.')).toBeInTheDocument();
});

test('rejects a start date after the end date and clears the previous result', () => {
  render(<FilterTasks tasks={tasks} />);
  apply();
  expect(screen.getByText('3 tasks match.')).toBeInTheDocument();

  setDate('Start date', '2026-09-24');
  setDate('End date', '2026-09-20');
  expect(screen.getByLabelText('Start date')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('End date')).toHaveAttribute('aria-invalid', 'true');

  apply();
  expect(toast.error).toHaveBeenCalledWith('Start date must be on or before end date');
  expect(screen.queryByText(/match/)).not.toBeInTheDocument();
});

test('reset clears the filters and shows all tasks again', () => {
  render(<FilterTasks tasks={tasks} />);
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'dead');
  apply();
  expect(screen.getByText('1 task matches.')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('');
  expect(screen.getByText('3 tasks match.')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

describe('pagination', () => {
  const manyTasks = Array.from({ length: 7 }, (_, index) =>
    makeTask(index, { status: index < 6 ? 'queued' : 'dead' }),
  );

  test('pages through results without pressing Apply', () => {
    render(<FilterTasks tasks={manyTasks} />);
    expect(screen.getByText('7 tasks match.')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

    userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('keeps the applied filters when paging, ignoring unapplied form changes', () => {
    render(<FilterTasks tasks={manyTasks} />);
    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'queued');
    apply();
    expect(screen.getByText('6 tasks match.')).toBeInTheDocument();

    userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'dead');
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('6 tasks match.')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  test('Apply goes back to the first page', () => {
    render(<FilterTasks tasks={manyTasks} />);
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

    apply();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('moves back to the last page when the results shrink', () => {
    const { rerender } = render(<FilterTasks tasks={manyTasks} />);
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

    rerender(<FilterTasks tasks={manyTasks.slice(0, 3)} />);
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });
});
