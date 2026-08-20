import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
function BookControls()
{
    return (
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-4 shadow-sm">
            <SearchBar />
            <CategoryFilter />
            <SortSelect />
        </div>
    );
}

export default BookControls;