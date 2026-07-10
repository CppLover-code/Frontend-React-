import useBook from "../hooks/useBook";

function SortSelect()
{
    const { selectedSort, setSelectedSort, sortOptions } = useBook();

    return (
        <>
            <p>Sorting:</p>
            <select
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
        </>
    );
}

export default SortSelect;