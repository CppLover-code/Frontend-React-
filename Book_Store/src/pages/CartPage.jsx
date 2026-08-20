import { useState } from "react";
import CartList from "../components/CartList";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";
import useNotification from "../hooks/useNotification";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function isProfileComplete(user) {
    if (!user) return false;
    return [
        user.first_name,
        user.last_name,
        user.phone,
        user.city,
        user.street,
        user.postal_code,
    ].every((value) => value && value.trim());
}

function CartPage() {

    const { cart, loading, error, checkout } = useCart();
    const { showNotification } = useNotification();
    const { user } = useAuth();
    const navigate = useNavigate();
    const profileComplete = isProfileComplete(user);
    const { refreshBooks } = useBook();

    const [placingOrder, setPlacingOrder] = useState(false);

    if (loading || !cart) return <p className="status-message">Loading...</p>;
    if (error) return <p className="status-error">Something went wrong :(</p>;

    async function handleCheckout() {
        setPlacingOrder(true);

        try {
            await checkout();
            refreshBooks();

            showNotification({
                message: "Order placed successfully!",
                type: "success"
            });
            navigate("/orders");
        } catch {
            showNotification({
                message: "Failed to place order",
                type: "error"
            });
        } finally {
            setPlacingOrder(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="section-kicker">Your bag</p>
                <h1 className="page-title mt-1">Cart</h1>
                <span className="title-underline" />
            </div>

            <CartList />

            {cart.items.length > 0 && (
                <div className="card-surface space-y-3 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="font-heading text-[1.5em] text-gold dark:text-accent">
                            Total: ${Number(cart.total_price).toFixed(2)}
                        </p>

                        <button
                            onClick={handleCheckout}
                            disabled={placingOrder || !profileComplete}
                            className="btn-primary"
                        >
                            {placingOrder ? "Placing order..." : "Checkout"}
                        </button>
                    </div>

                    {!profileComplete && (
                        <p className="text-sm text-gold dark:text-accent">
                            Fill in your name and shipping address in{" "}
                            <Link to="/profile" className="font-medium underline">
                                your profile
                            </Link>{" "}
                            before checkout.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CartPage;