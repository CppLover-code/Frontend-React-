import useBook from "../hooks/useBook";

function SortSelect()
{
    const { selectedSort, setSelectedSort, sortOptions } = useBook();

    return (
        <label className="field-label">
            Sorting:
            <select
            className="input-field"
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