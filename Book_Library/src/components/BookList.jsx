import Book from "./Book";
import useBook from "../hooks/useBook";

function BookList() 
{
    const {books} = useBook();

    return (
        <> 
            <h1>Books Page</h1>
            
            {books.map(book => (
                <Book 
                    key={book.id}
                    book={book}
                />
            ))}
        </>
    );
}

export default BookList;