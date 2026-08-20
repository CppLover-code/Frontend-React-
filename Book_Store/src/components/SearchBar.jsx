import { useState, useEffect } from "react";
import useBook from "../hooks/useBook";

const DEBOUNCE_MS = 300;

function SearchBar()
{
    const { searchQuery, setSearchQuery } = useBook();

    const [inputValue, setInputValue] = useState(searchQuery);

    useEffect(() => {

        if (inputValue === searchQuery) return;

        const timer = setTimeout(() => {
            setSearchQuery(inputValue);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, searchQuery]);

    return (
        <label className="field-label">
            Search
            <input
                type="text"
                placeholder="Title or description..."
                className="input-field w-56"
                value={inputValue}
                onChange={(event) =>
                    setInputValue(event.target.value)
                }/>
        </label>
    );
}

export default SearchBar;
