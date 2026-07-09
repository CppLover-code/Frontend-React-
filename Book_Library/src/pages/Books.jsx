import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

function Books()
{
    return( 
        <>
            <SearchBar />
            <CategoryFilter />
            <BookList /> 
        </>
    );
}

export default Books;