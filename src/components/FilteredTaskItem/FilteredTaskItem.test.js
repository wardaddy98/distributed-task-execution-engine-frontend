import { render, screen } from '@testing-library/react';
import FilteredTaskItem from '.';

const task = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  type: 'report_generation',
  priority: 4,
  status: 'dead',
  progress: 80,
  retries: 3,
  createdAt: '2026-09-24T14:32:00.000Z',
};

test('shows type, status, priority, created date and full id', () => {
  render(<FilteredTaskItem task={task} />);
  expect(screen.getByRole('heading', { name: 'report_generation' })).toBeInTheDocument();
  expect(screen.getByText('dead')).toBeInTheDocument();

  const values = screen.getAllByRole('definition').map(dd => dd.textContent);
  expect(values).toEqual(['4', new Date(task.createdAt).toLocaleString(), task.id]);
});

test('is information only, with no buttons', () => {
  render(<FilteredTaskItem task={task} />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
