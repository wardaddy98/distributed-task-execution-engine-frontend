import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import FilterTasks from '.';
import { get } from '../../service/api';

jest.mock('../../service/api', () => ({ get: jest.fn() }));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

const makeTask = id => ({
  id: `${id}0000000-0000-0000-0000-000000000000`,
  type: 'image_processing',
  priority: 3,
  status: 'queued',
  createdAt: '2026-09-20T10:00:00',
});

// Mirrors the backend: { status, message, body: { data, pagination } }.
const respond = (data, currentPage = 1, totalPages = 1) =>
  get.mockResolvedValue({
    status: 200,
    message: 'Task loaded Successfully',
    body: { data, pagination: { totalCount: data.length, totalPages, currentPage } },
  });

const apply = () => userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

beforeEach(() => {
  get.mockReset();
  toast.error.mockClear();
});

test('fetches page 1 on mount and shows the returned tasks', async () => {
  respond([makeTask(1), makeTask(2)]);
  render(<FilterTasks />);

  expect(await screen.findAllByRole('article')).toHaveLength(2);
  expect(get).toHaveBeenCalledWith('/task', expect.objectContaining({ page: 1 }));
});

test('Apply sends the selected filters as query params', async () => {
  respond([makeTask(1)]);
  render(<FilterTasks />);
  await screen.findByRole('article');

  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'dead');
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Priority' }), '5');
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-09-01' } });
  apply();

  expect(get).toHaveBeenLastCalledWith('/task', {
    status: 'dead',
    type: '',
    priority: '5',
    startDate: '2026-09-01',
    endDate: '',
    page: 1,
  });
});

test('changing the page fetches that page', async () => {
  respond([makeTask(1)], 1, 3);
  render(<FilterTasks />);
  await screen.findByText('Page 1 of 3');

  respond([makeTask(2)], 2, 3);
  userEvent.click(screen.getByRole('button', { name: 'Next' }));

  expect(await screen.findByText('Page 2 of 3')).toBeInTheDocument();
  expect(get).toHaveBeenLastCalledWith('/task', expect.objectContaining({ page: 2 }));
});

test('Apply on a later page goes back to page 1', async () => {
  respond([makeTask(1)], 1, 3);
  render(<FilterTasks />);
  await screen.findByText('Page 1 of 3');

  respond([makeTask(2)], 2, 3);
  userEvent.click(screen.getByRole('button', { name: 'Next' }));
  await screen.findByText('Page 2 of 3');

  respond([makeTask(3)], 1, 3);
  apply();
  expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
  expect(get).toHaveBeenLastCalledWith('/task', expect.objectContaining({ page: 1 }));
});

test('shows an empty message when nothing matches', async () => {
  respond([], 1, 0);
  render(<FilterTasks />);
  expect(await screen.findByText('No tasks found.')).toBeInTheDocument();
});

test('shows a toast when the request fails', async () => {
  get.mockRejectedValue(new Error('Server down'));
  render(<FilterTasks />);
  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Server down'));
});

test('Reset clears the filter fields', async () => {
  respond([]);
  render(<FilterTasks />);
  await screen.findByText('No tasks found.');
  userEvent.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'dead');
  userEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('');
});
