import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '.';

const renderPagination = (currentPage, totalPages) => {
  const handleNext = jest.fn();
  const handlePrevious = jest.fn();
  render(
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />,
  );
  return { handleNext, handlePrevious };
};

test('shows the current page and total pages', () => {
  renderPagination(2, 5);
  expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveTextContent('Page 2 of 5');
});

test('calls handleNext and handlePrevious', () => {
  const { handleNext, handlePrevious } = renderPagination(2, 5);
  userEvent.click(screen.getByRole('button', { name: 'Next' }));
  userEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(handleNext).toHaveBeenCalledTimes(1);
  expect(handlePrevious).toHaveBeenCalledTimes(1);
});

test('disables Previous on the first page', () => {
  renderPagination(1, 3);
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('disables Next on the last page', () => {
  renderPagination(3, 3);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
});
