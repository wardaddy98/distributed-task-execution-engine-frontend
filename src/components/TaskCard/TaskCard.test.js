import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '.';

const baseTask = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  type: 'image_processing',
  priority: 4,
  status: 'queued',
  progress: 0,
  retries: 0,
  createdAt: '2026-09-24T14:32:00.000Z',
};

const renderCard = (overrides = {}) => {
  const onCancel = jest.fn();
  const onRetry = jest.fn();
  render(<TaskCard task={{ ...baseTask, ...overrides }} onCancel={onCancel} onRetry={onRetry} />);
  return { onCancel, onRetry };
};

test('uses priority, short id and time as the heading, with the type below', () => {
  renderCard();
  expect(screen.getByRole('heading', { name: /^P4 · #a1b2c3d4 · / })).toBeInTheDocument();
  expect(screen.getByText('image_processing')).toBeInTheDocument();
  expect(screen.queryByText('queued')).not.toBeInTheDocument();
});

test('running shows a progress bar and a cancel button', () => {
  const { onCancel } = renderCard({ status: 'running', progress: 62 });
  expect(screen.getByText('62%')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onCancel).toHaveBeenCalledWith(baseTask.id);
});

test('queued has a cancel button but no progress bar', () => {
  renderCard({ status: 'queued' });
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
});

test('failed shows the retry attempt and no actions', () => {
  renderCard({ status: 'failed', retries: 2 });
  expect(screen.getByText('Retrying · attempt 2 of 3')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('dead has a retry button', () => {
  const { onRetry } = renderCard({ status: 'dead', retries: 3 });
  expect(screen.getByText('Failed after 3 retries')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(onRetry).toHaveBeenCalledWith(baseTask.id);
});

test('completed has no actions', () => {
  renderCard({ status: 'completed', progress: 100 });
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
