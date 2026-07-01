import BookList from "../components/BookList";

function Books({books, deleteBook, updateBook})
{
    return(
        <>
            <h1>Books Page</h1>

            <BookList>
                books={books}
                deleteBook={deleteBook}
                updateBook={updateBook}
            </BookList>
        
        </>
);
}

export default Books;