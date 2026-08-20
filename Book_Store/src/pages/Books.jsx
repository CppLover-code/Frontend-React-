import BookList from "../components/BookList";
import BookControls from "../components/BookControls";
import BookForm from "../components/BookForm";
import useAuth from "../hooks/useAuth";
import Pagination from "../components/Pagination";

function Books()
{
    const { user } = useAuth();
    
    return( 
        <div className="space-y-10">
            <div>
                <p className="section-kicker">Catalog</p>
                <h1 className="page-title mt-1">Books</h1>
                <span className="title-underline" />
            </div>
            <BookControls />
            {user?.is_staff && <BookForm mode="create" />}
            <BookList />  
            <Pagination />
        </div>
    );
}

export default Books;