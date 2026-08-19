import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

function CartItem({ item }) {

    const { id, book, quantity, subtotal } = item;

    const {
        removeFromCart,
        decreaseQuantity,
        increaseQuantity
    } = useCart();

    return (
        <article className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

            <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50">
                {book.cover ? (
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="max-h-full max-w-full object-contain"
                    />
                ) : (
                    <span>📚</span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <Link
                    to={`/books/${book.id}`}
                    className="font-semibold text-gray-900 hover:text-teal-700"
                >
                    {book.title}
                </Link>
                <p className="text-sm text-gray-500">
                    {book.authors.map(author => author.name).join(", ")}
                </p>
                <p className="text-sm text-gray-500">${book.price} each</p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => decreaseQuantity(id)}
                    className="h-8 w-8 cursor-pointer rounded-md border border-gray-300 text-lg leading-none hover:bg-gray-100"
                >
                    −
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                    onClick={() => increaseQuantity(id)}
                    disabled={quantity >= book.stock}
                    className="h-8 w-8 cursor-pointer rounded-md border border-gray-300 text-lg leading-none hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    +
                </button>
            </div>

            <p className="w-20 text-right font-semibold text-teal-700">
                ${Number(subtotal).toFixed(2)}
            </p>

            <button
                onClick={() => removeFromCart(id)}
                className="cursor-pointer text-sm text-red-600 hover:underline"
            >
                Remove
            </button>

        </article>
    );
}

export default CartItem;