import useBook from "../hooks/useBook";

function Pagination() {

    const { page, setPage, hasNext, hasPrev, count } = useBook();

    if (count === 0) return null;

    return (
        <div className="flex items-center justify-center gap-3">
    
            <button
                onClick={() => setPage(page - 1)}
                disabled={!hasPrev}
                className="btn-muted btn-sm"
            >
                ← Prev
            </button>
    
            <span className="text-sm uppercase tracking-[0.12em] text-muted dark:text-faint">Page {page}</span>
    
            <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
                className="btn-muted btn-sm"
            >
                Next →
            </button>
    
        </div>
    );
}

export default Pagination;