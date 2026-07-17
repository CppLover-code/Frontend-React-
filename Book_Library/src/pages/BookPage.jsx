import { Link, useParams } from "react-router-dom";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";

function BookPage()
{
    const { addToCart } = useCart();
    const { getBook } = useBook();
    
    const {id} = useParams();

    const book = getBook(id);

    if(!book) return (<h2>Book not found!</h2>)

    const {
        title,
        authors,
        categories,
        price,
        description
    } = book;

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

            <Link to={`/books/${id}/edit`}>
                <button>Edit</button>
            </Link>
        </>
    );
}

export default BookPage;