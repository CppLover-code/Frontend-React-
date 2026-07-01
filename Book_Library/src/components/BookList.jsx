import Book from "./Book";

function BookList({ books, deleteBook, updateBook}) 
{
    return (
        <>
            {books.map(book => (
                
                    <Book
                        book={book}
                    />

                    <button onClick={() => deleteBook(book.id)}>
                        Delete
                    </button>

                    <button onClick={() => updateBook(book.id)}>
                        Update
                    </button>
            ))}
        </>
    );
}

export default BookList;