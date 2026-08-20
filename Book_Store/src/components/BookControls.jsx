import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
function BookControls()
{
    return (
        <div className="card-surface flex flex-wrap items-end gap-4 p-4">
            <SearchBar />
            <CategoryFilter />
            <SortSelect />
        </div>
    );
}

export default BookControls;