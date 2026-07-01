function Book({book}) 
{
    const {
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

            <button>Delete</button>

            <button>Update</button>

        </article>
    );
}

export default Book;
