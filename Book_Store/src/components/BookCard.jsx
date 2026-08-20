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
        <article className="group flex flex-col">

            <div className="relative mb-1 flex h-72 w-full items-center justify-center overflow-hidden border border-cover-border bg-shelf p-[12%] dark:border-night-border dark:bg-night-shelf">
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

            <div className="mt-8 mb-8 text-center">
                <h3 className="font-heading text-[1.4em] font-medium text-gold dark:text-accent">{title}</h3>

                <p className="text-sm text-muted dark:text-faint">{authorNames}</p>

                <p className="text-xs uppercase tracking-wide text-faint">{categoryNames}</p>

                <p className="mt-2 line-clamp-2 text-sm text-muted dark:text-faint">{description}</p>

                <div className="mt-3 flex items-center justify-center gap-4">
                    <span className="font-heading text-[1.3em] text-gold dark:text-accent">${price}</span>
                    <span className="text-xs text-faint">In stock: {stock}</span>
                </div>
            </div>

            <div className="mt-auto flex gap-2">
                <Link
                    to={`/books/${id}`}
                    className="btn-outline btn-sm flex-1"
                >
                    Details
                </Link>

                {!user?.is_staff && (
                    soldOut ? (
                        <span className="flex-1 bg-paper-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-muted dark:bg-night-shelf dark:text-faint">
                            Out of stock
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={cartFull}
                            className="btn-primary btn-sm flex-1"
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
