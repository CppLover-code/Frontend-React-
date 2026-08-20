import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function CartList()
{
    const { cart } = useCart();

    if (cart.items.length === 0)
    {
        return (
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-8 text-center shadow-sm">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Your cart is empty</p>
                <Link
                    to="/books"
                    className="mt-3 inline-block text-sm font-medium text-teal-700 dark:text-teal-400 hover:underline"
                >
                    Browse books
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {cart.items.map(item => (
                <CartItem
                    key={item.id}
                    item={item}
                />
            ))}
        </div>
    );
}

export default CartList;