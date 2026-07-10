import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortSelect from "../components/SortSelect";

function Books()
{
    return( 
        <>
            <SearchBar />
            <CategoryFilter />
            <SortSelect />
            <BookList /> 
        </>
    );
}

export default Books;