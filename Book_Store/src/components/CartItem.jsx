import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function CartItem({ item }) {

    const { id, book, quantity, subtotal } = item;

    const {
        removeFromCart,
        decreaseQuantity,
        increaseQuantity
    } = useCart();

    return (
        <article>

            <Link to={`/books/${book.id}`}>{book.title}</Link>

            <p>Authors: {book.authors.map(author => author.name).join(", ")}</p>

            <p>Price: ${book.price}</p>

            <p>Quantity: {quantity}</p>

            <p>Subtotal: ${Number(subtotal).toFixed(2)}</p>

            <button onClick={() => removeFromCart(id)}>Remove</button>

            <button onClick={() => increaseQuantity(id)}>+</button>

            <button onClick={() => decreaseQuantity(id)}>-</button>

        </article>
    );
}

export default CartItem;