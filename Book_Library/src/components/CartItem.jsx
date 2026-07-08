import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function CartItem({item})
{
    const { 
        id,
        title,
        authors,
        price,
        quantity  
    }   = item;

    const {
        removeFromCart,
        decreaseQuantity,
        increaseQuantity
    } = useCart();

    const subtotal = quantity * price;

    return(
        <article>

            <Link to={`/books/${id}`}>{title}</Link>

            <p>Authors: {authors.join(", ")}</p>

            <p>Price: ${price}</p>

            <p>Quantity: {quantity}</p>

            <p>Subtotal: ${subtotal.toFixed(2)}</p>

            <button onClick={() => removeFromCart(id)}>Remove</button>

            <button onClick={() => increaseQuantity(id)}>+</button>

            <button onClick={() => decreaseQuantity(id)}>-</button>

        </article>
    );  
}

export default CartItem;