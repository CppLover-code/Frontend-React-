import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import CoverFallback from "./CoverFallback";

function CartItem({ item }) {

    const { id, book, quantity, subtotal } = item;

    const {
        removeFromCart,
        decreaseQuantity,
        increaseQuantity
    } = useCart();

    return (
        <article className="card-surface flex flex-wrap items-center gap-4 p-4">

            <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden border border-cover-border bg-shelf dark:border-night-border dark:bg-night-shelf">
                {book.cover ? (
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="max-h-full max-w-full object-contain"
                    />
                ) : (
                    <CoverFallback className="h-8 w-8" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <Link
                    to={`/books/${book.id}`}
                    className="font-heading text-[1.1em] text-gold hover:text-ink-deep dark:text-accent dark:hover:text-paper"
                >
                    {book.title}
                </Link>
                <p className="text-sm text-muted dark:text-faint">
                    {book.authors.map(author => author.name).join(", ")}
                </p>
                <p className="text-sm text-faint">${book.price} each</p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => decreaseQuantity(id)}
                    className="h-8 w-8 cursor-pointer border border-line text-lg leading-none hover:bg-paper-muted dark:border-night-border dark:hover:bg-night"
                >
                    −
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                    onClick={() => increaseQuantity(id)}
                    disabled={quantity >= book.stock}
                    className="h-8 w-8 cursor-pointer border border-line text-lg leading-none hover:bg-paper-muted disabled:cursor-not-allowed disabled:opacity-40 dark:border-night-border dark:hover:bg-night"
                >
                    +
                </button>
            </div>

            <p className="w-20 text-right font-heading text-[1.2em] text-gold dark:text-accent">
                ${Number(subtotal).toFixed(2)}
            </p>

            <button
                onClick={() => removeFromCart(id)}
                className="cursor-pointer text-sm uppercase tracking-wide text-red-700 hover:underline"
            >
                Remove
            </button>

        </article>
    );
}

export default CartItem;