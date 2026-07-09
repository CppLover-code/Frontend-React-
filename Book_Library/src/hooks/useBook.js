import { useContext } from "react";
import { BookContext, BookProvider } from "../contexts/BookContext";

function useBook()
{
    const context = useContext(BookContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}
export default useBook;