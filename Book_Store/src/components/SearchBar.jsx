import { useState, useEffect } from "react";
import useBook from "../hooks/useBook";

const DEBOUNCE_MS = 300;

function SearchBar()
{
    const { searchQuery, setSearchQuery } = useBook();

    // Локальное значение инпута обновляется мгновенно,
    // а в контекст (и на сервер) уходит только после паузы в наборе
    const [inputValue, setInputValue] = useState(searchQuery);

    useEffect(() => {
        // текст не менялся (например, компонент только что смонтирован) -
        // ничего не шлем, иначе setSearchQuery сбросит страницу на первую
        if (inputValue === searchQuery) return;

        const timer = setTimeout(() => {
            setSearchQuery(inputValue);
        }, DEBOUNCE_MS);

        // новый символ до истечения таймера - старый таймер отменяется
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, searchQuery]);

    return (
        <>
            <p>Search:</p>
            <input
            type="text"
            value={inputValue}
            onChange={(event) =>
                setInputValue(event.target.value)
            }/>
        </>
    );
}

export default SearchBar;
