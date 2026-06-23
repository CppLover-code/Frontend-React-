import Book from "./Book";

function BookForm({
    title,
    setTitle,
    author,
    setAuthor,
    addBook
}) {
    return (
        <>
            <label>Book title</label>

            <input
            type="text"
            value={title}
            onChange={(event) =>
                setTitle(event.target.value)
            }
            />

            <br/>
            <br/>

            <label>Book author</label>

            <input
            type="text"
            value={author}
            onChange={(event) =>
                setAuthor(event.target.value)
            }
            />

            <br/>
            <br/>

            <button onClick={addBook}>
                Add Book
            </button>
        </>
    );
}

export default BookForm;