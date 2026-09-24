import { render, screen, within } from '@testing-library/react';
import TasksSection from '.';

const makeTask = (id, status) => ({
  id: `${id}0000000-0000-0000-0000-000000000000`,
  type: 'image_processing',
  priority: 3,
  status,
  progress: 50,
  retries: 1,
  createdAt: '2026-09-24T14:32:00.000Z',
});

const getColumn = title =>
  screen.getByRole('heading', { level: 3, name: new RegExp(`^${title}`) }).parentElement;

test('renders the Tasks section with a column per status', () => {
  render(<TasksSection tasks={[]} />);
  expect(screen.getByRole('region', { name: 'Tasks' })).toBeInTheDocument();
  ['Running', 'Queued', 'Failed', 'Dead', 'Completed'].forEach(title =>
    expect(
      screen.getByRole('heading', { level: 3, name: new RegExp(`^${title}`) }),
    ).toBeInTheDocument(),
  );
});

test('places each task in the column for its status, with counts', () => {
  render(
    <TasksSection
      tasks={[makeTask(1, 'running'), makeTask(2, 'queued'), makeTask(3, 'queued'), makeTask(4, 'dead')]}
    />,
  );

  expect(within(getColumn('Running')).getAllByRole('article')).toHaveLength(1);
  expect(within(getColumn('Queued')).getAllByRole('article')).toHaveLength(2);
  expect(within(getColumn('Dead')).getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('heading', { level: 3, name: /^Queued.*2 tasks$/ })).toBeInTheDocument();
});

test('shows an empty message for columns without tasks', () => {
  render(<TasksSection tasks={[makeTask(1, 'running')]} />);
  expect(within(getColumn('Completed')).getByText('No tasks')).toBeInTheDocument();
  expect(within(getColumn('Running')).queryByText('No tasks')).not.toBeInTheDocument();
});

test('renders dummy tasks by default', () => {
  render(<TasksSection />);
  expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
});
