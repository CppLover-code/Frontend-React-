import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useNotification from "../hooks/useNotification";
import useAuth from "../hooks/useAuth";
import { ApiError } from "../api/client";

function BookCard({ book }) {
    const { addToCart, cart } = useCart();
    const { showNotification } = useNotification();
    const { user } = useAuth();

    const {
        id,
        title,
        authors,
        categories,
        price,
        stock,
        description,
        cover
    } = book;

    const quantityInCart =
        cart?.items.find((item) => item.book.id === id)?.quantity ?? 0;
    const soldOut = stock === 0;
    const cartFull = quantityInCart >= stock;

    const authorNames = authors.map(author => author.name).join(", ");
    const categoryNames = categories.map(category => category.name).join(", ");

    async function handleAddToCart() {
        try {
            await addToCart(book);
            showNotification({
                message: "Book added to cart",
                type: "success",
            });
        } catch (err) {
            let message = "Failed to add book to cart";

            if (err instanceof ApiError && err.status === 401) {
                message = "Please log in to add books to cart";
            } else if (
                err instanceof ApiError &&
                typeof err.data?.detail === "string"
            ) {
                message = err.data.detail;
            }

            showNotification({ message, type: "error" });
        }
    }


    return (
        <article className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-4 shadow-sm transition-shadow hover:shadow-md">

            <div className="mb-1 flex h-56 w-full items-center justify-center rounded-md bg-white dark:bg-gray-900">
                {cover ? (
                    <img
                        src={cover}
                        alt={title}
                        className="max-h-full max-w-full object-contain"
                    />
                ) : (
                    <span className="text-4xl">📚</span>
                )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">{authorNames}</p>

            <p className="text-xs text-gray-400 dark:text-gray-500">{categoryNames}</p>

            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>

            <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xl font-bold text-teal-700 dark:text-teal-400">${price}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">In stock: {stock}</span>
            </div>

            <div className="flex gap-2">
                <Link
                    to={`/books/${id}`}
                    className="flex-1 rounded-md border border-teal-700 px-3 py-2 text-center text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950"
                >
                    Details
                </Link>

                {!user?.is_staff && (
                    soldOut ? (
                        <span className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            Out of stock
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={cartFull}
                            className="flex-1 cursor-pointer rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Add to Cart
                        </button>
                    )
                )}
            </div>

        </article>
    );
}

export default BookCard;
