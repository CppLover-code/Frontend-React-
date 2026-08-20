import BookCard from "./BookCard";
import useBook from "../hooks/useBook";

function BookList()
{
    const { visibleBooks, loading, error } = useBook();

    if (loading) return <p className="status-message">Loading...</p>;

    if (error) return <p className="status-error">Failed to load books :(</p>;

    if (visibleBooks.length === 0) {
        return <p className="status-message">No books found</p>;
    }

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBooks.map(book => (
                <BookCard
                    key={book.id}
                    book={book}
                />
            ))}
        </div>
    );
}

export default BookList;