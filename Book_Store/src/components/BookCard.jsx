import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useNotification from "../hooks/useNotification";
import useAuth from "../hooks/useAuth";

function BookCard({ book }) {
    const { addToCart } = useCart();
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

    const authorNames = authors.map(author => author.name).join(", ");
    const categoryNames = categories.map(category => category.name).join(", ");

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
        <article className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">

            {cover ? (
                <img
                    src={cover}
                    alt={title}
                    className="mb-1 h-56 w-full rounded-md object-cover"
                />
            ) : (
                <div className="mb-1 flex h-56 w-full items-center justify-center rounded-md bg-gray-100 text-4xl">
                    📚
                </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

            <p className="text-sm text-gray-600">{authorNames}</p>

            <p className="text-xs text-gray-400">{categoryNames}</p>

            <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

            <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xl font-bold text-teal-700">${price}</span>
                <span className="text-xs text-gray-400">In stock: {stock}</span>
            </div>

            <div className="flex gap-2">
                <Link
                    to={`/books/${id}`}
                    className="flex-1 rounded-md border border-teal-700 px-3 py-2 text-center text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
                >
                    Details
                </Link>

                {!user?.is_staff && (
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 cursor-pointer rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                    >
                        Add to Cart
                    </button>
                )}
            </div>

        </article>
    );
}

export default BookCard;
