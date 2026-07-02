import { useParams } from "react-router-dom";

function BookDetails({books})
{
    const {id} = useParams();

    const book = books.find(book => book.id === Number(id));

    if(!book) return (<h2>Book not found!</h2>)

    const {
        title,
        authors,
        category,
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
            <p>{category}</p>

            <h3>Price:</h3>
            <p>${price}</p>

            <h3>Description:</h3>
            <p>{description}</p>
        </>
    );
}

export default BookDetails;