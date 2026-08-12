import BookList from "../components/BookList";
import BookControls from "../components/BookControls";
import BookForm from "../components/BookForm";
import useAuth from "../hooks/useAuth";
import Pagination from "../components/Pagination";

function Books()
{
    const { user } = useAuth();
    
    return( 
        <div className="book-controls">
            <BookControls />
            {user?.is_staff && <BookForm mode="create" />}
            <BookList />  
            <Pagination />
        </div>
    );
}

export default Books;