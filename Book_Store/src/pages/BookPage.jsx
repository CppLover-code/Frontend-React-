import { Link, useParams, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";
import useBookDetail from "../hooks/useBookDetail";
import useNotification from "../hooks/useNotification";

function BookPage()
{
    const { showNotification } = useNotification();
    const { addToCart } = useCart();
    const { deleteBook } = useBook();
    const {id} = useParams();
    const { book, loading, error } = useBookDetail(id); 

    const navigate = useNavigate();

    if (loading) return <h2>Loading...</h2>;
    if (error?.status === 404) return <h2>Book not found!</h2>;
    if (error) return <h2>Something went wrong :(</h2>;

    const {
        title,
        authors,
        categories,
        price,
        description
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
                type: "success" });
            navigate("/books");
        } catch {
            showNotification({
                message: "Failed to delete book",
                type: "error" });
        }
    }

    return (
        <>
            <h1>Book Page</h1>

            <h3>Title:</h3>
            <p>{title}</p>

            <h3>Authors:</h3>
            <p>{authors
                    .map(author => author.name)
                    .join(", ")}
            </p>

            <h3>Category:</h3>
            <p>{categories
                .map(category => category.name)
                .join(", ")}
            </p>

            <h3>Price:</h3>
            <p>${price}</p>

            <h3>Description:</h3>
            <p>{description}</p>

            <button onClick={() => addToCart(book)}>Add to Cart</button>

            <button onClick={() => handleDelete()}>Delete</button>

            <Link to={`/books/${id}/edit`}>
                <button>Edit</button>
            </Link>
        </>
    );
}

export default BookPage;