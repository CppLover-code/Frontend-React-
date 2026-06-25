import Book from "./Book";

function BookList({ books, deleteBook, updateBook}) {
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

                    <button onClick={() => updateBook(book.id)}>
                        Update
                    </button>
                </div>
            ))}
        </>
    );
}

export default BookList;