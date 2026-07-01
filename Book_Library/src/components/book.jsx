function Book({book, deleteBook, updateBook}) 
{
    const {
        id,
        title,
        author,
        price,
        category
    } = book;



    return (
        <article>
            <h2>Book title: {title}</h2>

            <p>Author: {author}</p>

            <p>Category: {category}</p>

            <p>Price: ${price}</p>

            <button>Details</button>

            <button>Add to Cart</button>

            <button onClick={() => deleteBook(id)}>Delete</button>

            <button onClick={() => updateBook(id)}>Update</button>

        </article>
    );
}

export default Book;
