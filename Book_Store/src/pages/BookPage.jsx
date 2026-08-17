import { Link, useParams, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";
import useBookDetail from "../hooks/useBookDetail";
import useNotification from "../hooks/useNotification";
import useAuth from "../hooks/useAuth";

function BookPage() {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const { addToCart } = useCart();
    const { deleteBook } = useBook();
    const { id } = useParams();
    const { book, loading, error } = useBookDetail(id);

    const navigate = useNavigate();

    if (loading) return <p className="py-12 text-center text-gray-500">Loading...</p>;
    if (error?.status === 404) return <p className="py-12 text-center text-gray-500">Book not found!</p>;
    if (error) return <p className="py-12 text-center text-red-600">Something went wrong :(</p>;

    const {
        title,
        authors,
        categories,
        price,
        stock,
        description,
        cover
    } = book;

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
                type: "success"
            });
        } catch {
            showNotification({
                message: "Please log in to add books to cart",
                type: "error"
            });
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-4">

            <Link
                to="/books"
                className="text-sm font-medium text-teal-700 hover:underline"
            >
                ← Back to books
            </Link>

            <article className="grid gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-[240px_1fr]">
                {cover ? (
                    <img
                        src={cover}
                        alt={title}
                        className="w-full rounded-md object-cover"
                    />
                ) : (
                    <div className="flex min-h-72 items-center justify-center rounded-md bg-gray-100 text-6xl">
                        📚
                    </div>
                )}
                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

                    <p className="text-gray-600">
                        {authors
                            .map(author => author.name)
                            .join(", ")}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <span
                                key={category.id}
                                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-2xl font-bold text-teal-700">${price}</span>
                        <span className="text-sm text-gray-400">In stock: {stock}</span>
                    </div>

                    <p className="leading-relaxed text-gray-700">{description}</p>

                    <div className="flex gap-2 border-t border-gray-100 pt-4">

                        {!user?.is_staff && (
                            <button
                                onClick={handleAddToCart}
                                className="cursor-pointer rounded-md bg-teal-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                            >
                                Add to Cart
                            </button>
                        )}

                        {user?.is_staff && (
                            <>
                                <Link
                                    to={`/books/${id}/edit`}
                                    className="rounded-md border border-teal-700 px-5 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="cursor-pointer rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
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