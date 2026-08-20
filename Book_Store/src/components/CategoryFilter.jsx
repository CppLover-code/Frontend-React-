import useBook from "../hooks/useBook";

function CategoryFilter() {
    const {
        selectedCategoryId,
        setSelectedCategoryId,
        categoryOptions
    } = useBook();

    return (
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
            Category
            <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-teal-800"
                value={selectedCategoryId}
                onChange={(event) =>
                    setSelectedCategoryId(
                        Number(event.target.value)
                    )}>
    
                {categoryOptions.map(category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default CategoryFilter;