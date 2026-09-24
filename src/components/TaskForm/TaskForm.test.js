import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import TaskForm from '.';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

const getType = () => screen.getByRole('combobox', { name: 'Type' });
const getPriority = () => screen.getByRole('combobox', { name: 'Priority' });
const getPayload = () => screen.getByRole('textbox', { name: /payload/i });
const submit = () => userEvent.click(screen.getByRole('button', { name: 'Submit task' }));

beforeEach(() => {
  toast.error.mockClear();
});

test('shows type and priority options as-is, with nothing selected', () => {
  render(<TaskForm />);
  expect(getType()).toHaveValue('');
  expect(getPriority()).toHaveValue('');
  ['image_processing', 'report_generation', '1', '2', '3', '4', '5'].forEach(name =>
    expect(screen.getByRole('option', { name })).toBeInTheDocument(),
  );
});

test('defaults the payload to {}', () => {
  render(<TaskForm />);
  expect(getPayload()).toHaveValue('{}');
});

test('requires a type', () => {
  render(<TaskForm />);
  userEvent.selectOptions(getPriority(), '3');
  submit();
  expect(toast.error).toHaveBeenCalledWith('Type is required');
});

test('requires a priority', () => {
  render(<TaskForm />);
  userEvent.selectOptions(getType(), 'report_generation');
  submit();
  expect(toast.error).toHaveBeenCalledWith('Priority is required');
});

test('rejects an invalid payload', () => {
  render(<TaskForm />);
  userEvent.selectOptions(getType(), 'image_processing');
  userEvent.selectOptions(getPriority(), '5');
  fireEvent.change(getPayload(), { target: { value: '[1, 2]' } });
  submit();
  expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/must be a JSON object/));
});

test('accepts an empty payload when type and priority are set', () => {
  render(<TaskForm />);
  userEvent.selectOptions(getType(), 'image_processing');
  userEvent.selectOptions(getPriority(), '1');
  fireEvent.change(getPayload(), { target: { value: '' } });
  submit();
  expect(toast.error).not.toHaveBeenCalled();
});
