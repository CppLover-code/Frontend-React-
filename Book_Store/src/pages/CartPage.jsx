import { useState } from "react";
import CartList from "../components/CartList";
import useCart from "../hooks/useCart";
import useNotification from "../hooks/useNotification";

function CartPage() {

    const { cart, loading, error, checkout } = useCart();
    const { showNotification } = useNotification();

    const [placingOrder, setPlacingOrder] = useState(false);

    if (loading || !cart) return <h2>Loading...</h2>;
    if (error) return <h2>Something went wrong :(</h2>;

    async function handleCheckout() {
        setPlacingOrder(true);

        try {
            await checkout();

            showNotification({
                message: "Order placed successfully!",
                type: "success" });
        } catch {
            showNotification({
                message: "Failed to place order",
                type: "error" });
        } finally {
            setPlacingOrder(false);
        }
    }

    return (
        <>
            <CartList />

            <h2>Total: ${Number(cart.total_price).toFixed(2)}</h2>

            {cart.items.length > 0 && (
                <button onClick={handleCheckout} disabled={placingOrder}>
                    {placingOrder ? "Placing order..." : "Checkout"}
                </button>
            )}
        </>
    );
}

export default CartPage;