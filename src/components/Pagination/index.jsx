import Button from '../Button';

const Pagination = ({ currentPage, totalPages, handleNext, handlePrevious }) => (
  <nav aria-label="Pagination" className="flex items-center justify-between gap-3 sm:justify-end">
    <Button
      color="secondary"
      variant="outlined"
      onClick={handlePrevious}
      disabled={currentPage <= 1}
    >
      Previous
    </Button>
    <p aria-live="polite" className="text-sm tabular-nums text-slate-300">
      Page {currentPage} of {totalPages}
    </p>
    <Button
      color="secondary"
      variant="outlined"
      onClick={handleNext}
      disabled={currentPage >= totalPages}
    >
      Next
    </Button>
  </nav>
);

export default Pagination;
