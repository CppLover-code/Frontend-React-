import BookList from "../components/BookList";
import BookControls from "../components/BookControls";
import BookForm from "../components/BookForm";
import useAuth from "../hooks/useAuth";
import Pagination from "../components/Pagination";

function Books()
{
    const { user } = useAuth();
    
    return( 
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Books</h1>
            <BookControls />
            {user?.is_staff && <BookForm mode="create" />}
            <BookList />  
            <Pagination />
        </div>
    );
}

export default Books;