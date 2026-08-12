import useBook from "../hooks/useBook";

function Pagination() {

    const { page, setPage, hasNext, hasPrev, count } = useBook();

    if (count === 0) return null;

    return (
        <div className="pagination">

            <button
                onClick={() => setPage(page - 1)}
                disabled={!hasPrev}
            >
                ← Prev
            </button>

            <span> Page {page} </span>

            <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
            >
                Next →
            </button>

        </div>
    );
}

export default Pagination;