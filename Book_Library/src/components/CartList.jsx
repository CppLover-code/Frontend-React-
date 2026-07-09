import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function CartList()
{
    const { cart } = useCart();

    if(cart.length === 0)
    {
        return(
            <>
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
                />

            ))}
        </>
    );  
}

export default CartList;