import CartList from "../components/CartList";
import useCart from "../hooks/useCart";

function CartPage() 
{
    const { cart } = useCart();

    const total = cart.reduce((acc, item) => {
        const {price, quantity} = item;
        return acc + price * quantity;
    }, 0);

    return (
        <>
            <CartList />

            <h2>Total: ${total.toFixed(2)}</h2>
        </>
    );
}

export default CartPage;