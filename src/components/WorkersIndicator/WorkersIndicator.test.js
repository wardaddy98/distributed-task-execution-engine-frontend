import { render, screen, within } from '@testing-library/react';
import WorkersIndicator from '.';

test('renders the Workers heading', () => {
  render(<WorkersIndicator total={4} idle={3} busy={1} />);
  expect(screen.getByRole('heading', { name: 'Workers' })).toBeInTheDocument();
});

test('shows total, idle and busy counts from props', () => {
  render(<WorkersIndicator total={8} idle={5} busy={3} />);
  const terms = screen.getAllByRole('term');
  const definitions = screen.getAllByRole('definition');

  expect(terms.map(term => term.textContent)).toEqual(['Total', 'Idle', 'Busy']);
  expect(definitions.map(definition => definition.textContent)).toEqual(['8', '5', '3']);
});

test('renders zero counts', () => {
  render(<WorkersIndicator total={0} idle={0} busy={0} />);
  const section = screen.getByRole('heading', { name: 'Workers' }).closest('section');
  expect(within(section).getAllByText('0')).toHaveLength(3);
});
