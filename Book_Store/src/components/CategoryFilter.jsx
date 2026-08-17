import useBook from "../hooks/useBook";

function CategoryFilter() {
    const {
        selectedCategoryId,
        setSelectedCategoryId,
        categoryOptions
    } = useBook();

    return (
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
            Search
            <input
                type="text"
                placeholder="Title or description..."
                className="w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                value={inputValue}
                onChange={(event) =>
                    setInputValue(event.target.value)
                }/>
        </label>
    );
}

export default CategoryFilter;