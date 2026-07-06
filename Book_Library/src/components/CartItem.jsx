import { Link } from "react-router-dom";

function CartItem({item})
{
    const { 
        id,
        title,
        authors,
        price,
        quantity  
    }   = item;

    const subtotal = quantity * price;

    return(
        <article>

            <Link to={`/books/${id}`}>{title}</Link>

            <p>Authors: {authors.join(", ")}</p>

            <p>Price: ${price}</p>

            <p>Quantity: {quantity}</p>

            <p>Subtotal: ${subtotal.toFixed(2)}</p>

        </article>
    );  
}

export default CartItem;