import Book from "./Book";

function BookList({ books, deleteBook}) {
    return (
        <>
            {books.map(book => (
                <div key={book.id}>
                    <Book
                        title={book.title}
                        author={book.author}
                    />

                    <button onClick={() => deleteBook(book.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
}

export default BookList;