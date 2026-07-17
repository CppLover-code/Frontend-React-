import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";

function Book({book}) 
{
    const {deleteBook, updateBook} = useBook();
    const {addToCart} = useCart();

    const {
        id,
        title,
        authors,
        categories,
        price,
        stock,
        description
    } = book;

    const authorNames = authors.map(author => author.name).join(", ");
    const categoryNames = categories.map(category => category.name).join(", ");
    return (
        <article>

            <h3>Title: {title}</h3>

            <p>Authors: {authorNames}</p>

            <p>Categories: {categoryNames}</p>

            <p>Price: ${price}</p>

            <p>Stock: {stock}</p>

            <p>Description: {description}</p>

            <Link to={`/books/${id}`}>Details</Link>

            <button onClick={() => addToCart(book)}>Add to Cart</button>

            <button onClick={() => deleteBook(id)}>Delete</button>

            <button onClick={() => updateBook(id)}>Update</button>


        </article>
    );
}

export default Book;
