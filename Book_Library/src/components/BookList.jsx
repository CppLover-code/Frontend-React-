import Book from "./Book";
import useBook from "../hooks/useBook";

function BookList() 
{
    const {visibleBooks} = useBook();

    return (
        <> 
            <h1>Books Page</h1>
            
            {visibleBooks.map(book => (
                <Book 
                    key={book.id}
                    book={book}
                />
            ))}
        </>
    );
}

export default BookList;