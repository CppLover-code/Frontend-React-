import BookCard from "./BookCard";
import useBook from "../hooks/useBook";

function BookList()
{
    const { visibleBooks, loading, error } = useBook();

    if (loading) return <p className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</p>;

    if (error) return <p className="py-12 text-center text-red-600">Failed to load books :(</p>;

    if (visibleBooks.length === 0) {
        return <p className="py-12 text-center text-gray-500 dark:text-gray-400">No books found</p>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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