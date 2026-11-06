import { type FC } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages < 1) {
        return null;
    }

    const page = Math.min(Math.max(currentPage, 1), totalPages);
    const visiblePageCount = Math.min(totalPages, 5);
    const firstVisiblePage = Math.max(1, Math.min(page - 2, totalPages - visiblePageCount + 1));
    const lastVisiblePage = firstVisiblePage + visiblePageCount - 1;
    const visiblePages = Array.from(
        { length: visiblePageCount },
        (_, index) => firstVisiblePage + index,
    );

    return (
        <nav className="mt-6 flex justify-center text-sm text-white" aria-label="Pagination">
            <div className="flex items-center gap-2 md:hidden">
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                    aria-label="Go to first page"
                >
                    <span aria-hidden="true">&laquo;</span>
                </button>
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Go to previous page"
                >
                    <span aria-hidden="true">&larr;</span>
                </button>
                <span aria-live="polite">Page {page} of {totalPages}</span>
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Go to next page"
                >
                    <span aria-hidden="true">&rarr;</span>
                </button>
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages}
                    aria-label="Go to last page"
                >
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </div>
            <div className="hidden items-center gap-2 md:flex">
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                >
                    First
                </button>
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Go to previous page"
                >
                    Previous
                </button>
                {firstVisiblePage > 1 && (
                    <>
                        <PageButton page={1} currentPage={page} onPageChange={onPageChange} />
                        {firstVisiblePage > 2 && <span aria-hidden="true">...</span>}
                    </>
                )}
                {visiblePages.map(visiblePage => (
                    <PageButton
                        key={visiblePage}
                        page={visiblePage}
                        currentPage={page}
                        onPageChange={onPageChange}
                    />
                ))}
                {lastVisiblePage < totalPages && (
                    <>
                        {lastVisiblePage < totalPages - 1 && <span aria-hidden="true">...</span>}
                        <PageButton page={totalPages} currentPage={page} onPageChange={onPageChange} />
                    </>
                )}
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Go to next page"
                >
                    Next
                </button>
                <button
                    type="button"
                    className="rounded bg-gray-800 px-3 py-2 enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages}
                >
                    Last
                </button>
            </div>
        </nav>
    );
};

interface PageButtonProps {
    page: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PageButton: FC<PageButtonProps> = ({ page, currentPage, onPageChange }) => (
    <button
        type="button"
        className={`min-w-10 rounded px-3 py-2 ${
            page === currentPage ? 'bg-blue-600 font-semibold' : 'bg-gray-800 hover:bg-gray-700'
        }`}
        onClick={() => onPageChange(page)}
        aria-label={`Go to page ${page}`}
        aria-current={page === currentPage ? 'page' : undefined}
    >
        {page}
    </button>
);
