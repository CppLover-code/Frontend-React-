import { Link } from "react-router-dom";

function Book({book, deleteBook, updateBook, addToCart}) 
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

            <p>Authors: {authors.join(", ")}</p>

            <p>Category: {category}</p>

            <p>Price: ${price}</p>

            <Link to={`/books/${id}`}>Details</Link>

            <button onClick={() => addToCart(book)}>Add to Cart</button>

            <button onClick={() => deleteBook(id)}>Delete</button>

            <button onClick={() => updateBook(id)}>Update</button>

        </article>
    );
}

export default Book;
