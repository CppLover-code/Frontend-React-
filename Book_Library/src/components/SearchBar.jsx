import useBook from "../hooks/useBook";

function SearchBar()
{
    const {searchQuery, setSearchQuery} = useBook();

    return (
        <>
            <p>Search:</p>
            <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
                setSearchQuery(event.target.value)
            }/>
        </>
    );
}

export default SearchBar;