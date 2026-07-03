import BookList from "../components/BookList";

function Books({books, deleteBook, updateBook, addToCart})
{
    return(
        <>
            <BookList
                books={books}
                deleteBook={deleteBook}
                updateBook={updateBook}
                addToCart={addToCart}
            />
        </>
    );
}

export default Books;