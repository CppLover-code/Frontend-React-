import { Link } from "react-router-dom";

function Book({book, deleteBook, updateBook}) 
{
    const {
        id,
        title,
        authors,
        category,
        price
    } = book;



    return (
        <article>

            <h3>Title: {title}</h3>

            <p>Author: {authors.join(", ")}</p>

            <p>Category: {category}</p>

            <p>Price: ${price}</p>

            <Link to={`/books/${id}`}>Details</Link>

            <button>Add to Cart</button>

            <button onClick={() => deleteBook(id)}>Delete</button>

            <button onClick={() => updateBook(id)}>Update</button>

        </article>
    );
}

export default Book;
