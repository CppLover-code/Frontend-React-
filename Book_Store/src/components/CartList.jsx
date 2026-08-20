import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function CartList()
{
    const { cart } = useCart();

    if (cart.items.length === 0)
    {
        return (
            <div className="card-surface p-8 text-center">
                <p className="font-heading text-[1.5em] text-ink dark:text-paper">Your cart is empty</p>
                <Link
                    to="/books"
                    className="link-accent mt-3 inline-block text-sm uppercase tracking-[0.12em]"
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