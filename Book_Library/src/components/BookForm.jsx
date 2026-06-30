import  { useState } from "react"

function BookForm({ addBook}) 
{
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    function handleSubmit(event) 
    {
        event.preventDefault();
        addBook(title, author);

        setTitle("");
        setAuthor("");
    }

    return (
        <form onSubmit={handleSubmit}>
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

            <button type="submit">Add Book</button>
        </form>
    );
}

export default BookForm;