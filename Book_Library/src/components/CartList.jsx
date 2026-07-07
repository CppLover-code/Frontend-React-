import CartItem from "./CartItem";
import { Link } from "react-router-dom";

function CartList({cart, removeFromCart, decreaseQuantity, increaseQuantity})
{
    if(cart.length === 0)
    {
        return(
            <>польно
                <h2>🛒 Your cart is empty</h2>
                <Link to="/books">Browse books</Link>
            </>
        );
    }
    return(
        <>
            <h2>CartList</h2>

            {cart.map(item => (

                <CartItem
                    key={item.id}
                    item={item}
                    removeFromCart={removeFromCart}
                    decreaseQuantity={decreaseQuantity}
                    increaseQuantity={increaseQuantity}
                />

            ))}
        </>
    );  
}

export default CartList;