import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function Book({book, deleteBook, updateBook}) 
{
    const {
        id,
        title,
        authors,
        category,
        price
    } = book;

    const {addToCart} = useCart();


    return (
        <article>

            <h3>Title: {title}</h3>

            <p>Authors: {authors.join(", ")}</p>

            <p>Category: {category}</p>

            <p>Price: ${price}</p>

            <Link to={`/books/${id}`}>Details</Link>

            <button onClick={() => deleteBook(id)}>Delete</button>

            <button onClick={() => updateBook(id)}>Update</button>

            <button onClick={() => addToCart(book)}>Add to Cart</button>

        </article>
    );
}

export default Book;
