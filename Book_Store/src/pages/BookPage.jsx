import { Link, useParams, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";
import useBookDetail from "../hooks/useBookDetail";
import useNotification from "../hooks/useNotification";
import useAuth from "../hooks/useAuth";
import { ApiError } from "../api/client";

function BookPage() {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const { addToCart, cart } = useCart();
    const { deleteBook } = useBook();
    const { id } = useParams();
    const { book, loading, error } = useBookDetail(id);

    const navigate = useNavigate();

    if (loading) return <p className="status-message">Loading...</p>;
    if (error?.status === 404) return <p className="status-message">Book not found!</p>;
    if (error) return <p className="status-error">Something went wrong :(</p>;

    const {
        title,
        authors,
        categories,
        price,
        stock,
        description,
        cover
    } = book;

    const quantityInCart =
        cart?.items.find((item) => item.book.id === book.id)?.quantity ?? 0;
    const soldOut = stock === 0;
    const cartFull = quantityInCart >= stock;

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );
        if (!confirmed) return;
        try {
            await deleteBook(book.id);
            showNotification({
                message: "Book deleted successfully!",
                type: "success"
            });
            navigate("/books");
        } catch {
            showNotification({
                message: "Failed to delete book",
                type: "error"
            });
        }
    }

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
        <div className="mx-auto max-w-3xl space-y-4">

            <Link
                to="/books"
                className="link-accent text-sm uppercase tracking-[0.12em]"
            >
                ← Back to books
            </Link>

            <article className="grid gap-8 md:grid-cols-[240px_1fr]">
                {cover ? (
                    <div className="border border-cover-border bg-shelf p-[12%] dark:border-night-border dark:bg-night-shelf">
                        <img
                            src={cover}
                            alt={title}
                            className="w-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex min-h-72 items-center justify-center border border-cover-border bg-shelf text-6xl dark:border-night-border dark:bg-night-shelf">
                        📚
                    </div>
                )}
                <div className="space-y-5">
                    <h1 className="page-title">{title}</h1>

                    <p className="text-muted dark:text-faint">
                        {authors
                            .map(author => author.name)
                            .join(", ")}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <span
                                key={category.id}
                                className="chip"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="font-heading text-[1.6em] text-gold dark:text-accent">${price}</span>
                        <span className="text-sm text-faint">In stock: {stock}</span>
                    </div>

                    <p className="leading-[2] text-muted dark:text-faint">{description}</p>

                    <div className="flex gap-2 border-t border-line pt-6 dark:border-night-border">

                        {!user?.is_staff && (
                            soldOut ? (
                                <span className="bg-paper-muted px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted dark:bg-night-shelf dark:text-faint">
                                    Out of stock
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={cartFull}
                                    className="btn-primary"
                                >
                                    Add to Cart
                                </button>
                            )
                        )}

                        {user?.is_staff && (
                            <>
                                <Link
                                    to={`/books/${id}/edit`}
                                    className="btn-outline"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="btn-danger"
                                >
                                    Delete
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </article>

        </div>
    );
}

export default BookPage;