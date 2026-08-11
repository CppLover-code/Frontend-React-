import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useNotification from "../hooks/useNotification";

function BookCard({book}) 
{
    const {addToCart} = useCart();
    const { showNotification } = useNotification();

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

    async function handleAddToCart() {
        try {
            await addToCart(book);
            showNotification({
                message: "Book added to cart",
                type: "success"
            });
        } catch {
            showNotification({
                message: "Please log in to add books to cart",
                type: "error"
            });
        }
    }


    return (
        <article>

            <h3>Title: {title}</h3>

            <p>Authors: {authorNames}</p>

            <p>Categories: {categoryNames}</p>

            <p>Price: ${price}</p>

            <p>Stock: {stock}</p>

            <p>Description: {description}</p>

            <Link to={`/books/${id}`}>Details</Link>

            <button onClick={handleAddToCart}>Add to Cart</button>

        </article>
    );
}

export default BookCard;
