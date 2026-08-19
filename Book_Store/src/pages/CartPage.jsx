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

    if (loading || !cart) return <p className="py-12 text-center text-gray-500">Loading...</p>;
    if (error) return <p className="py-12 text-center text-red-600">Something went wrong :(</p>;

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
            <h1 className="text-3xl font-bold text-gray-900">Cart</h1>

            <CartList />

            {cart.items.length > 0 && (
                <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-xl font-bold text-gray-900">
                            Total: ${Number(cart.total_price).toFixed(2)}
                        </p>

                        <button
                            onClick={handleCheckout}
                            disabled={placingOrder || !profileComplete}
                            className="cursor-pointer rounded-md bg-teal-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {placingOrder ? "Placing order..." : "Checkout"}
                        </button>
                    </div>

                    {!profileComplete && (
                        <p className="text-sm text-amber-700">
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