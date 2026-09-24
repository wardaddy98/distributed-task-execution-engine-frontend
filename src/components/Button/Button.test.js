import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '.';

test('renders a primary normal button of type "button" by default', () => {
  render(<Button>Save</Button>);
  const button = screen.getByRole('button', { name: 'Save' });
  expect(button).toHaveAttribute('type', 'button');
  expect(button).toHaveClass('bg-sky-500');
});

test.each([
  ['primary', 'normal', 'bg-sky-500'],
  ['primary', 'outlined', 'border-sky-400'],
  ['primary', 'text', 'text-sky-300'],
  ['secondary', 'normal', 'bg-slate-700'],
  ['secondary', 'outlined', 'border-slate-500'],
  ['secondary', 'text', 'text-slate-300'],
])('applies %s %s styles', (color, variant, expectedClass) => {
  render(
    <Button color={color} variant={variant}>
      Go
    </Button>,
  );
  expect(screen.getByRole('button', { name: 'Go' })).toHaveClass(expectedClass);
});

test('passes through type, className and other props', () => {
  const handleClick = jest.fn();
  render(
    <Button type="submit" className="w-full" onClick={handleClick}>
      Submit
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Submit' });
  expect(button).toHaveAttribute('type', 'submit');
  expect(button).toHaveClass('w-full');

  userEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('does not fire clicks when disabled', () => {
  const handleClick = jest.fn();
  render(
    <Button disabled onClick={handleClick}>
      Disabled
    </Button>,
  );
  userEvent.click(screen.getByRole('button', { name: 'Disabled' }));
  expect(handleClick).not.toHaveBeenCalled();
});
