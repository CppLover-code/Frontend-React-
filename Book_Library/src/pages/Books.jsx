import BookList from "../components/BookList";
import BookControls from "../components/BookControls";

function Books()
{
    return( 
        <div className="book-controls">
            <BookControls />
            <BookList /> 
        </div>
    );
}

export default Books;