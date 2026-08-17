import useBook from "../hooks/useBook";

function SortSelect()
{
    const { selectedSort, setSelectedSort, sortOptions } = useBook();

    return (
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
            Sorting:
            <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                value={selectedSort}
                onChange={(event) =>
                    setSelectedSort(event.target.value)
                }>

                {sortOptions.map(option => (
                    <option 
                        key={option.value}
                        value={option.value}
                        >
                            {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default SortSelect;