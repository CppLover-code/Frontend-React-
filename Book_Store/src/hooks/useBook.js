import { useContext } from "react";

function useBook()
{
    const context = useContext(BookContext);
    if (!context) {
        throw new Error("useBook must be used within BookProvider");
    }

    return context;
}
export default useBook;