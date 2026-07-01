import BookList from "../components/BookList";

function Books({books, deleteBook, updateBook})
{
    return(
        <>
            <BookList
                books={books}
                deleteBook={deleteBook}
                updateBook={updateBook}
            />
        </>
    );
}

export default Books;