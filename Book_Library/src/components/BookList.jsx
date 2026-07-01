import Book from "./Book";

function BookList({books, deleteBook, updateBook}) 
{
    return (
        <>
            {books.map(book => (
                <Book 
                    key={book.id}
                    book={book}
                    deleteBook={deleteBook}
                    updateBook={updateBook}
                />
            ))}
        </>
    );
}

export default BookList;