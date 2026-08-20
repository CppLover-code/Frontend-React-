import useBook from "../hooks/useBook";

function Pagination() {

    const { page, setPage, hasNext, hasPrev, count } = useBook();

    if (count === 0) return null;

    return (
        <div className="flex items-center justify-center gap-3">
    
            <button
                onClick={() => setPage(page - 1)}
                disabled={!hasPrev}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
                ← Prev
            </button>
    
            <span className="text-sm text-gray-600 dark:text-gray-300">Page {page}</span>
    
            <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
                Next →
            </button>
    
        </div>
    );
}

export default Pagination;