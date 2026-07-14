import { useParams } from "react-router-dom";
import useCart from "../hooks/useCart";
import useBook from "../hooks/useBook";

function BookDetails()
{
    const {addToCart} = useCart();
    const {books} = useBook();
    
    const {id} = useParams();

    const book = books.find(book => book.id === Number(id));

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
            <h1>Book Details</h1>

            <h3>Title:</h3>
            <p>{title}</p>

            <h3>Authors:</h3>
            <p>{authors.join(", ")}</p>

            <h3>Category:</h3>
            <p>{categories}</p>

            <h3>Price:</h3>
            <p>${price}</p>

            <h3>Description:</h3>
            <p>{description}</p>

            <button onClick={() => addToCart(book)}>Add to Cart</button>
        </>
    );
}

export default BookDetails;