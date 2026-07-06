import Book from "./Book";

function BookList({books, deleteBook, updateBook, addToCart}) 
{
    return (
        <> 
            <h1>Books Page</h1>
            
            {books.map(book => (
                <Book 
                    key={book.id}
                    book={book}
                    deleteBook={deleteBook}
                    updateBook={updateBook}
                    addToCart={addToCart}
                />
            ))}
        </>
    );
}

export default BookList;