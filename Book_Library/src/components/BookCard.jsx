import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function BookCard({book}) 
{
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

        </article>
    );
}

export default BookCard;
