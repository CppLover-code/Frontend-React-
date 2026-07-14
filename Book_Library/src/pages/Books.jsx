import BookList from "../components/BookList";
import BookControls from "../components/BookControls";
import BookForm from "../components/BookForm";

function Books()
{
    return( 
        <div className="book-controls">
            <BookControls />
            <BookForm />
            <BookList />  
        </div>
    );
}

export default Books;